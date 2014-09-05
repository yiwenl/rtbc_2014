//
//  SceneRibbon.cpp
//  Ribbons02
//
//  Created by Yiwen on 18/07/2014.
//
//

#include "SceneRibbon.h"
#include "GlobalSettings.h"
#include "Utils.h"

using namespace ci;
using namespace bongiovi::utils;

SceneRibbon::SceneRibbon(app::WindowRef window) : Scene(window) {
    _ribbons.clear();
    _ribbons.empty();
    
    initTextures();
    initViews();

}


void SceneRibbon::setState(int index) {
    if(_state >= index) return;
    
    _state = index;
    if(_state == 1) {
//        initTextures();
//        initViews();
    }
}

void SceneRibbon::initTextures() {
    _texBg          = Utils::createTexture("common/floor.jpg");
    _texBgDark      = Utils::createTexture("common/floorBlue.jpg");
    
    _movie = qtime::MovieGl( cinder::app::loadResource("videos/bw.mp4"));
    _movie.setLoop();
    _movie.play();
    
    gl::Fbo::Format format;
    format.setMinFilter(GL_LINEAR);
    format.setMagFilter(GL_LINEAR);
    format.setSamples(4);
    format.enableMipmapping();
    
    int size        = 1024 * 2;
    _strokes        = new gl::Fbo(size, size, format);
    _strokes->bindFramebuffer();
    gl::clear();
    _strokes->unbindFramebuffer();
    
    
    for(int i=0; i<12; i++) {
        string path = "brushes/brush" + std::to_string(i) + ".png";
        gl::TextureRef brush = Utils::createTexture(path);
        _brushes.push_back(brush);
    }

    
    for(int i=1; i<=6; i++) {
        string path = "drops/drop0" + std::to_string(i) + ".png";
        gl::TextureRef drop = Utils::createTexture(path);
        _drops.push_back(drop);
    }

    updateBrush();
}


void SceneRibbon::initViews() {
    _vBg            = new ViewCopy();
    _vPost          = new ViewPost();
    _vDrop          = new ViewDrop();
}


void SceneRibbon::createRibbon() {
    if(isStarted) return;
    isStarted       = true;
    _vRibbon        = new ViewRibbon(rand()%_brushes.size());
}


void SceneRibbon::saveRibbon() {
    _ribbons.push_back(_vRibbon);
    isStarted       = false;
}


void SceneRibbon::updateRibbon() {
    _vRibbon->update();
}


void SceneRibbon::updateBrush() {
    _texBrush = _brushes[rand() % _brushes.size()];
}


void SceneRibbon::clearAll() {
    _ribbons.empty();
    _ribbons.clear();
}


void SceneRibbon::render() {
    if(_state == 0) {
        renderWireFrame();
        return;
    }
    
    if(_state > 1) {
        gl::setMatrices(*_cameraOrtho);
        _vBg->render(GlobalSettings::getInstance().isInDark ? _texBgDark : _texBg);
    }
    
    Area viewport = gl::getViewport();
    
    _strokes->bindFramebuffer();
    gl::clear(ColorA(.0, .0, .0, .0));
    gl::setViewport(_strokes->getBounds());
    gl::setMatrices(*_camera);
    gl::rotate(sceneQuat->quat);
    
    int state = 1;
    for(int i =0; i<_ribbons.size(); i++) {
        if(_ribbons.size() == 1) state = 4;
        else {
            if(i == 0 ) state = 0;
            else if ( i == _ribbons.size() - 1) state = 2;
        }
        _ribbons[i]->render(_brushes[_ribbons[i]->textureIndex], state);
    }
    
    if(isStarted) _vRibbon->render(_brushes[_vRibbon->textureIndex]);
    
    for(int i =0; i<GlobalSettings::getInstance().inkDrops.size(); i++) {
        InkDrop* ink = GlobalSettings::getInstance().inkDrops[i];
        int state = 1;
        if(i == GlobalSettings::getInstance().inkDrops.size()-1 ) state = 2;
        else if ( i ==0 ) state = 0;
        _vDrop->render(ink, _drops[ink->textureIndex], state);
    }
    
    _strokes->unbindFramebuffer();
    
    gl::setViewport(viewport);
    gl::setMatrices(*_cameraOrtho);
    _vPost->render(_strokes->getTexture(), _movie.getTexture(), _texBg, _state > 2);
}


void SceneRibbon::renderWireFrame() {
    gl::color(91.0/255.0, 120.0/255.0, 118/255.0);
    for(int i=0; i<GlobalSettings::getInstance().pointsSpline.size() ; i++ ) {
      gl::drawSphere(GlobalSettings::getInstance().pointsSpline[i], 1);
    }
    
    
    gl::color(143/255.0, 158/255.0, 139/255.0);
    float width = GlobalSettings::getInstance().ribbonWidth * .5;
    for(int i=0; i<GlobalSettings::getInstance().pointsSpline.size() ; i++ ) {
        Vec3f p = GlobalSettings::getInstance().pointsSpline[i];
        Vec3f pLeft = p + GlobalSettings::getInstance().points[i]*width;
        Vec3f pRight = p - GlobalSettings::getInstance().points[i]*width;
        
        gl::drawLine(p, pLeft);
        gl::drawLine(p, pRight);
    }
    
    
    gl::color(242/255.0, 230/255.0, 182/255.0);
    for(int i=0; i<GlobalSettings::getInstance().pointsSpline.size() ; i++ ) {
        Vec3f p = GlobalSettings::getInstance().pointsSpline[i];
        Vec3f pNormal = p + GlobalSettings::getInstance().pointsNormal[i]*width;
        
        gl::drawLine(p, pNormal);
    }
}