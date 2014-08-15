//
//  TouchFinder.cpp
//  CalligraphyTouch
//
//  Created by Yiwen on 02/08/2014.
//
//

#include "TouchFinder.h"
#include "MathUtils.h"

using namespace bongiovi::utils;

TouchFinder::TouchFinder(SceneRibbon* scene) : _scene(scene) {
    _init();
}


void TouchFinder::_init() {
    mKinect			= Kinect::create(); // use the default Kinect
    _depthTexture	= gl::Texture( 640, 480 );
    _cameraOrtho    = new CameraOrtho();
    _cameraOrtho->setOrtho( -1, 1, 1, -1, -1, 1 );
    
    //  FBOS
    gl::Fbo::Format format;
    format.setMinFilter(GL_LINEAR_MIPMAP_NEAREST);
    format.setMagFilter(GL_LINEAR_MIPMAP_NEAREST);
    format.enableMipmapping();
    _fboDepth       = new gl::Fbo(640, 480, format);

    _vDot           = new ViewDot();
    _vCopy          = new ViewCopy();
    _vKDepth        = new ViewKinectDepth();
}


Vec2f TouchFinder::update() {
    if( mKinect->checkNewDepthFrame() ) {
        
        Area viewport = gl::getViewport();
        gl::setViewport(_fboDepth->getBounds());
        _fboDepth->bindFramebuffer();
        gl::clear(ColorAf(0.0, 0.0, 0.0, 1.0));
        gl::setMatrices(*_cameraOrtho);
		_depthTexture = mKinect->getDepthImage();
        _vKDepth->render(_depthTexture);
        _fboDepth->unbindFramebuffer();
        gl::setViewport(viewport);

        _surface = Surface(_fboDepth->getTexture());
        Vec2f pos = _getTouchPoint(_surface);
        
//        _vCopy->render(_depthTexture);
//        _vCopy->render(_fboDepth->getTexture());
        //  DEBUGGING
//        _vDot->render(Vec2f(.8, .2));
        
        if(pos.x > 0) {
            
            float tx = MathUtils::map(pos.x, 147, 590, .2, .8);
            float ty = MathUtils::map(pos.y, 90, 350, .2, .8);
//            cout << "POSITION : " << pos.x <<  " : " << tx << " -> " << getWindowWidth()*tx  << endl;
//            return Vec2f( tx * getWindowWidth(), -ty * getWindowHeight() );
            return Vec2f( tx * 1280.0, -ty * 720.0 );
        }
        return pos;
    }
    
    return Vec2f(99999, 99999);
}





Vec2f TouchFinder::_getTouchPoint(Surface surface) {
    Area area(0, 0, 640, 480);
    area = surface.getBounds();
    int max = -1;
    Vec2f pos(-10000.0, -10000.0);
    int margin = 40;
    int threshold = 20;
    
    Surface::ConstIter inputIter( surface.getIter() );
    
    int gap = 5;
    
    while( inputIter.line()) {
        while( inputIter.pixel() ) {
            Vec2f current = inputIter.getPos();
            int tx = floor(current.x);
            int ty = floor(current.y);
            if( tx % gap != 0  || ty % gap != 0 ) continue;
            
            
            if(current.x < margin || current.y < margin || current.x + margin > area.getWidth() || current.y +  margin > area.getHeight()) {
            } else {
                int grey = int(inputIter.r());
                if(grey > max && grey > threshold) {
                    max = grey; pos.set(current);
                }
            }
        }
    }
    
//    cout << pos << endl;
    
//    pos.x = ((pos.x-margin) / (640-margin*2)-.5) * ci::app::getWindowWidth();
//    pos.y = (.5 - (pos.y-margin) / (480-margin*2)) * ci::app::getWindowHeight();
    
    
    return pos;
}



void TouchFinder::shutdown() {
//    Kinect::
}