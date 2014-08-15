//
//  ViewMountain.h
//  Mountains
//
//  Created by Yiwen on 23/07/2014.
//
//

#ifndef __Mountains__ViewMountain__
#define __Mountains__ViewMountain__

#include <iostream>
#include "cinder/gl/Texture.h"
#include "View.h"
#include "cinder/Perlin.h"

using namespace bongiovi;

class ViewMountain : public View {
public:
    ViewMountain(Vec3f, float, float);
    ViewMountain(string vsPath, string fsPath, Vec3f, float, float);
    void                    render(gl::TextureRef);
    float                   size;
    float                   height;
    Vec3f                   location;
    int                     texIndex;
    int                     _power;
    
private:
    void                    _init();
    Perlin*                 _perlin;
    float                   _getHeight(int, int, int);
};

#endif /* defined(__Mountains__ViewMountain__) */
