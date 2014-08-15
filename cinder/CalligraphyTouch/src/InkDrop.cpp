//
//  InkDrop.cpp
//  Ribbons03
//
//  Created by Yiwen on 20/07/2014.
//
//

#include "InkDrop.h"
#include "MathUtils.h"

using namespace bongiovi::utils;

static int UVS[6]{4, 5, 5, 4, 5, 4};

InkDrop::InkDrop(Vec3f _loc, int index, float _size) {
    loc             = _loc;
    textureIndex    = index;
    currFrame       = 0;
    gap             = UVS[textureIndex];
    uvGap           = 1.0f / gap;
    totalFrames     = gap * gap;
    size            = _size;
    rotation        = MathUtils::random(M_PI * 2);
}


Vec2f InkDrop::update() {
    currFrame ++;
    if(currFrame >= totalFrames) currFrame = totalFrames-1;
    Vec2f uvOffset(0, 0);
    uvOffset.x = (currFrame % gap) * uvGap;
    uvOffset.y = floor(currFrame / gap) * uvGap;
    alpha           -= .01;
    
    return uvOffset;
}