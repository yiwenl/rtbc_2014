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
    _cameraStage    = new CameraOrtho();
    _cameraStage->setOrtho( 0, ci::app::getWindowWidth(), -ci::app::getWindowHeight(), 0, -1000, 1000 );
    
    _ribbons.clear();
    _ribbons.empty();
    
    _initTextures();
    _initViews();
}


void SceneRibbon::_initTextures() {
    _texBg          = Utils::createTexture("common/floor.jpg");
    _texBgDark      = Utils::createTexture("common/floorBlue.jpg");
    _texDrop        = Utils::createTexture("drops/drop01.png");
    
    gl::TextureRef brush0 = Utils::createTexture("brushes/brush0.png");
    gl::TextureRef brush1 = Utils::createTexture("brushes/brush1.png");
    gl::TextureRef brush2 = Utils::createTexture("brushes/brush2.png");
    gl::TextureRef brush3 = Utils::createTexture("brushes/brush3.png");
    gl::TextureRef brush4 = Utils::createTexture("brushes/brush4.png");
    gl::TextureRef brush5 = Utils::createTexture("brushes/brush5.png");
    
    gl::TextureRef drop0 = Utils::createTexture("drops/drop01.png");
    gl::TextureRef drop1 = Utils::createTexture("drops/drop02.png");
    gl::TextureRef drop2 = Utils::createTexture("drops/drop03.png");
    gl::TextureRef drop3 = Utils::createTexture("drops/drop04.png");
    gl::TextureRef drop4 = Utils::createTexture("drops/drop05.png");
    gl::TextureRef drop5 = Utils::createTexture("drops/drop06.png");

    _brushes    = vector<gl::TextureRef>{brush0,brush1,brush2,brush3,brush4,brush5};
    _drops      = vector<gl::TextureRef>{drop0,drop1,drop2,drop3,drop4,drop5};
    updateBrush();
}


void SceneRibbon::_initViews() {
    _vBg            = new ViewCopy();
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
    gl::setMatrices(*_cameraOrtho);
    _vBg->render(_texBg);
    
    gl::setMatrices(*_cameraStage);
//    gl::rotate(sceneQuat->quat);
//    gl::color(1.0, 0.0, 0.0, 1.0);
//    gl::drawSphere(Vec3f(0, 0, 0), 200);

    for(int i =0; i<_ribbons.size(); i++) {
        _ribbons[i]->render(_brushes[_ribbons[i]->textureIndex]);
    }
    
    if(isStarted) _vRibbon->render(_brushes[_vRibbon->textureIndex]);
    
    
    for(int i =0; i<GlobalSettings::getInstance().inkDrops.size(); i++) {
        InkDrop* ink = GlobalSettings::getInstance().inkDrops[i];
        _vDrop->render(ink, _drops[ink->textureIndex]);
    }
}