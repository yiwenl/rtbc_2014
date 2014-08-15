//
//  SceneMountain.h
//  Mountains
//
//  Created by Yiwen on 23/07/2014.
//
//

#ifndef __Mountains__SceneMountain__
#define __Mountains__SceneMountain__

#include <iostream>

#include "cinder/gl/Texture.h"
#include "cinder/gl/Fbo.h"
#include "Scene.h"
#include "ViewCopy.h"
#include "ViewDepth.h"
#include "ViewMountain.h"
#include "ViewBlur.h"
#include "ViewSun.h"
#include "ViewSSAO.h"
#include "EffectComposer.h"


using namespace bongiovi;
using namespace bongiovi::post;
using namespace ci;

class SceneMountain : public Scene {
public:
    SceneMountain(app::WindowRef);
    void                    render();
    
    
private:
    void                    _initTextures();
    void                    _initViews();
    
    
    gl::TextureRef          _texBg;
    gl::TextureRef          _texSun;
    gl::TextureRef          _texRnd;
    gl::TextureRef          _texMountain;
    vector<gl::TextureRef>  _textures;
    
    
    
    vector<ViewMountain*>   _mountains;
    ViewMountain*           _vMountain;
    ViewCopy*               _vBg;
    ViewDepth*              _vDepth;
    ViewSSAO*               _vSSAO;
    ViewSun*                _vSun;
    
    gl::Fbo*                _fboMountains;
    
    
    EffectComposer*         _compBlur;
    Pass*                   _passSSAO;
    
    bool                    _checkMountainPos(Vec3f v);
};

#endif /* defined(__Mountains__SceneMountain__) */
