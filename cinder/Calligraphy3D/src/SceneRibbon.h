//
//  SceneRibbon.h
//  Ribbons02
//
//  Created by Yiwen on 18/07/2014.
//
//

#ifndef __Ribbons02__SceneRibbon__
#define __Ribbons02__SceneRibbon__

#include <iostream>

#include "cinder/qtime/QuickTime.h"
#include "cinder/gl/Texture.h"
#include "cinder/gl/Fbo.h"
#include "cinder/Camera.h"
#include "Scene.h"
#include "ViewCopy.h"
#include "ViewRibbon.h"
#include "ViewDrop.h"
#include "ViewPost.h"
#include "ViewBlur.h"
#include "EffectComposer.h"

using namespace bongiovi;
using namespace bongiovi::post;
using namespace ci;

class SceneRibbon : public Scene {
public:
    SceneRibbon(app::WindowRef);
    void                    render();
    void                    renderWireFrame();
    void                    updateRibbon();
    void                    updateBrush();
    void                    createRibbon();
    void                    saveRibbon();
    void                    clearAll();
    bool                    isDarkStyle = false;
    bool                    isStarted = false;
    void                    initTextures();
    void                    initViews();
    void                    setState(int);
    
    
private:
    bool                    _isTextureCreated;
    int                     _state = 5;
    
    qtime::MovieGl          _movie;
    CameraOrtho*            _cameraStage;
    gl::TextureRef          _texBg;
    gl::TextureRef          _texBgDark;
    gl::TextureRef          _texBrush;
    gl::TextureRef          _texDrop;
    gl::Fbo*                _strokes;
    
    vector<gl::TextureRef>  _brushes;
    vector<gl::TextureRef>  _drops;
    
    ViewCopy*               _vBg;
    ViewPost*               _vPost;
    ViewRibbon*             _vRibbon;
    ViewDrop*               _vDrop;
    
    EffectComposer*         _compBlur;
    
    vector<ViewRibbon*>     _ribbons;
};

#endif /* defined(__Ribbons02__SceneRibbon__) */



















