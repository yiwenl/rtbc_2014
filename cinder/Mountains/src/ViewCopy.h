//
//  ViewCopy.h
//  Mountains
//
//  Created by Yiwen on 25/07/2014.
//
//

#ifndef __Mountains__ViewCopy__
#define __Mountains__ViewCopy__

#include <iostream>
#include "cinder/gl/Texture.h"
#include "View.h"

using namespace bongiovi;

class ViewCopy : public View {
public:
    ViewCopy();
    ViewCopy(string vsPath, string fsPath);
    void                    render(gl::Texture);
    void                    render(gl::TextureRef);
    
private:
    void                    _init();
};

#endif /* defined(__Mountains__ViewCopy__) */
