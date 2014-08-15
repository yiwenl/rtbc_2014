//
//  ViewKinectDepth.h
//  CalligraphyTouch
//
//  Created by Yiwen on 02/08/2014.
//
//

#ifndef __CalligraphyTouch__ViewKinectDepth__
#define __CalligraphyTouch__ViewKinectDepth__

#include <iostream>
#include "cinder/gl/Texture.h"
#include "View.h"

using namespace bongiovi;

class ViewKinectDepth : public View {
public:
    ViewKinectDepth();
    ViewKinectDepth(string vsPath, string fsPath);
    void                    render(gl::Texture);
    
private:
    void                    _init();
};

#endif /* defined(__CalligraphyTouch__ViewKinectDepth__) */
