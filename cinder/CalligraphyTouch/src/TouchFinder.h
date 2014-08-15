//
//  TouchFinder.h
//  CalligraphyTouch
//
//  Created by Yiwen on 02/08/2014.
//
//

#ifndef __CalligraphyTouch__TouchFinder__
#define __CalligraphyTouch__TouchFinder__

#include <iostream>
#include "cinder/gl/Texture.h"
#include "cinder/gl/Fbo.h"
#include "CinderFreenect.h"
#include "cinder/Camera.h"
#include "cinder/Surface.h"
#include "ViewCopy.h"
#include "ViewKinectDepth.h"
#include "ViewDot.h"
#include "SceneRibbon.h"


using namespace std;
using namespace ci;
using namespace ci::app;

class TouchFinder {
    public :
    TouchFinder(SceneRibbon* scene) ;
    KinectRef               mKinect;
    void                    shutdown();
    Vec2f                   update();
    
    private :
    void                    _init();
    SceneRibbon*            _scene;
    ViewCopy*               _vCopy;
    ViewKinectDepth*        _vKDepth;
    ViewDot*                _vDot;
    gl::Texture             _depthTexture;
    CameraOrtho*            _cameraOrtho;
    Surface                 _surface;
    gl::Fbo*                _fboDepth;
    Vec2f                   _getTouchPoint(Surface);
    bool                    _isDrawing = false;
};

#endif /* defined(__CalligraphyTouch__TouchFinder__) */
