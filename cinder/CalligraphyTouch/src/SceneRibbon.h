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

#include "cinder/gl/Texture.h"
#include "cinder/gl/Fbo.h"
#include "cinder/Camera.h"
#include "Scene.h"
#include "ViewCopy.h"
#include "ViewRibbon.h"
#include "ViewDrop.h"

using namespace bongiovi;
using namespace ci;

class SceneRibbon : public Scene {
public:
    SceneRibbon(app::WindowRef);
    void                    render();
    void                    updateRibbon();
    void                    updateBrush();
    void                    createRibbon();
    void                    saveRibbon();
    void                    clearAll();
    bool                    isDarkStyle = false;
    bool                    isStarted = false;
    
    
private:
    void                    _initTextures();
    void                    _initViews();
    
    CameraOrtho*            _cameraStage;
    gl::TextureRef          _texBg;
    gl::TextureRef          _texBgDark;
    gl::TextureRef          _texBrush;
    gl::TextureRef          _texDrop;
    
    vector<gl::TextureRef>  _brushes;
    vector<gl::TextureRef>  _drops;
    
    
    ViewCopy*               _vBg;
    ViewRibbon*             _vRibbon;
    ViewDrop*               _vDrop;
    
    vector<ViewRibbon*>     _ribbons;
};

#endif /* defined(__Ribbons02__SceneRibbon__) */
