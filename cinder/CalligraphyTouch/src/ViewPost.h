//
//  ViewPost.h
//  CalligraphyTouch
//
//  Created by Yiwen on 22/07/2014.
//
//

#ifndef __CalligraphyTouch__ViewPost__
#define __CalligraphyTouch__ViewPost__

#include <iostream>
#include "cinder/gl/Texture.h"
#include "View.h"

using namespace bongiovi;

class ViewPost : public View {
public:
    ViewPost();
    ViewPost(string vsPath, string fsPath);
    void                    render(gl::Texture, gl::Texture, gl::TextureRef);
    
private:
    void                    _init();
};

#endif /* defined(__CalligraphyTouch__ViewPost__) */
