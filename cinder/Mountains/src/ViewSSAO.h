//
//  ViewSSAO.h
//  Mountains
//
//  Created by Yiwen on 15/08/2014.
//
//

#ifndef __Mountains__ViewSSAO__
#define __Mountains__ViewSSAO__

#include <iostream>
#include "cinder/gl/Texture.h"
#include "ViewCopy.h"

using namespace bongiovi;

class ViewSSAO : public ViewCopy {
public:
    ViewSSAO();
    ViewSSAO(string vsPath, string fsPath);
    void                    render(gl::Texture);
    void                    setRandomTexture(gl::Texture texture) {
        _texRandom = texture;
    }
    
private:
    
    gl::Texture             _texRandom;
//    void                    _init();
};

#endif /* defined(__Mountains__ViewSSAO__) */
