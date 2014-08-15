//
//  ViewDepth.h
//  Mountains
//
//  Created by Yiwen on 31/07/2014.
//
//

#ifndef __Mountains__ViewDepth__
#define __Mountains__ViewDepth__

#include <iostream>
#include "cinder/gl/Texture.h"
#include "View.h"

using namespace bongiovi;

class ViewDepth : public View {
public:
    ViewDepth();
    ViewDepth(string vsPath, string fsPath);
    void                    render(gl::Texture, gl::Texture, gl::Texture);
    
private:
    void                    _init();
};

#endif /* defined(__Mountains__ViewDepth__) */
