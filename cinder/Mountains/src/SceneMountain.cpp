//
//  SceneMountain.cpp
//  Mountains
//
//  Created by Yiwen on 23/07/2014.
//
//

#include "SceneMountain.h"
#include "Utils.h"
#include "MathUtils.h"

using namespace bongiovi::utils;

SceneMountain::SceneMountain(app::WindowRef window) : Scene(window) {
    _camera->setPerspective( 75.0f, ci::app::getWindowAspectRatio(), 5.0f, 2000.0f );
    
    _mountains.clear();
    _mountains.empty();
    _textures.clear();
    _textures.empty();
    
    _initTextures();
    _initViews();
}


void SceneMountain::_initTextures() {
    _texBg          = Utils::createTexture("common/bg.jpg");
    _texSun         = Utils::createTexture("common/sun.png");
    _texRnd         = Utils::createTexture("common/noise.png");
    _texMountain    = Utils::createTexture("common/inkDrops/inkDrops0.jpg");
    
    for(int i=0; i<=33; i++) {
        string filename = "common/inkDrops/inkDrops" + std::to_string(i) + ".jpg";
        gl::TextureRef tex = Utils::createTexture(filename);
        _textures.push_back(tex);
    }
    
    
    gl::Fbo::Format format;
    format.enableColorBuffer( true, 2 );
    format.enableMipmapping();
    format.enableDepthBuffer();
    format.setColorInternalFormat( GL_RGBA32F_ARB );
    format.setMinFilter(GL_LINEAR);
    format.setMagFilter(GL_LINEAR);
    
    int size            = 1024;
    _fboMountains       = new gl::Fbo(size, size, format);
    
    _fboMountains->bindFramebuffer();
    gl::clear();
    _fboMountains->unbindFramebuffer();
}


void SceneMountain::_initViews() {
    _vBg            = new ViewCopy();
    _vSun           = new ViewSun();
    _vDepth         = new ViewDepth();
    _vSSAO          = new ViewSSAO();
    _vSSAO->setRandomTexture(*_texRnd);
    _passSSAO       = new Pass(_vSSAO);
    
    int maxMountains = 50;
    float range = 700;
    float twoPI = M_PI * 2.0;
    for(int i=0; i<maxMountains; i++) {
        Vec3f v;
        do {
            v.set(MathUtils::random(range), 0, 0);
            v.rotateX(MathUtils::random(twoPI));
            v.rotateY(MathUtils::random(twoPI));
            v.rotateZ(MathUtils::random(twoPI));
            v.y *= 0;
        } while (!_checkMountainPos(v) );
        
        ViewMountain* m = new ViewMountain(v, MathUtils::random(80.0, 160.0)*(.75 + v.length()/range * 1.0), MathUtils::random(70.0, 40.0) * (.75 + v.length()/range * 2.0));
        _mountains.push_back(m);
    }
    
    
    ViewBlur* vHBlur = new ViewBlur("shaders/blurh.vert", "shaders/blur.frag");
    ViewBlur* vVBlur = new ViewBlur("shaders/blurv.vert", "shaders/blur.frag");
    float blurRange = 2.5;
    vHBlur->blurOffset = blurRange;
    vVBlur->blurOffset = blurRange;
    
    
    _compBlur = new EffectComposer();
    Pass* passHBlur = new Pass(vHBlur, 512);
    Pass* passVBlur = new Pass(vVBlur, 512);
    _compBlur->addPass(passHBlur);
    _compBlur->addPass(passVBlur);
}


bool SceneMountain::_checkMountainPos(Vec3f v) {
    if(_mountains.size() == 0) return true;
    
    int minDist = 70;
    
    for(vector<ViewMountain*>::iterator it = _mountains.begin(); it!=_mountains.end(); it++) {
        if(((*it)->location - v).length() < minDist) return false;
    }
    
    return true;
}


void SceneMountain::render() {
    gl::disable(GL_DEPTH_TEST);
    gl::setMatrices(*_cameraOrtho);
    _vBg->render(_texBg);
    _vSun->render(*_texSun);
    gl::enable(GL_DEPTH_TEST);
    
    Area viewport = gl::getViewport();
    gl::setViewport(_fboMountains->getBounds());
    _fboMountains->bindFramebuffer();
    gl::clear(ColorAf(0.0, 0.0, 0.0, 0.0));
    gl::setMatrices(*_camera);
    gl::rotate(sceneQuat->quat);
    for(vector<ViewMountain*>::iterator it = _mountains.begin(); it!=_mountains.end(); it++) {
        (*it)->render(_textures[(*it)->texIndex]);
    }
    
    _fboMountains->unbindFramebuffer();
    
    gl::setViewport(viewport);
    gl::setMatrices(*_cameraOrtho);
    
//    gl::Texture texBlur = _compBlur->render(_fboMountains->getTexture());
    
//    _vDepth->render(texBlur, _fboMountains->getDepthTexture());
//    _vSSAO->render(_fboMountains->getDepthTexture());
    
//    gl::Texture texSSAO = _passSSAO->render(_fboMountains->getDepthTexture());
    _vDepth->render(_fboMountains->getTexture(), _fboMountains->getDepthTexture(), _passSSAO->render(_fboMountains->getDepthTexture()) );
}