//
//  ViewSun.h
//  Mountains
//
//  Created by Yiwen on 15/08/2014.
//
//

#ifndef __Mountains__ViewSun__
#define __Mountains__ViewSun__

#include <iostream>
#include "cinder/gl/Texture.h"
#include "View.h"

using namespace bongiovi;

class ViewSun : public View {
public:
    ViewSun();
    ViewSun(string vsPath, string fsPath);
    void                    render(gl::Texture);
    
private:
    void                    _init();
};
#endif /* defined(__Mountains__ViewSun__) */
