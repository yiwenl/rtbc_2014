//
//  InkDrop.h
//  Ribbons03
//
//  Created by Yiwen on 20/07/2014.
//
//

#ifndef __Ribbons03__InkDrop__
#define __Ribbons03__InkDrop__

#include <iostream>

using namespace std;
using namespace ci;

class InkDrop {
    public :
    InkDrop(Vec3f, int, float);
    
    Vec3f           loc;
    int             textureIndex;
    int             currFrame;
    int             totalFrames;
    int             gap;
    float           size;
    float           uvGap;
    float           rotation;
    float           alpha = 2.0f;
    
    
    Vec2f           update();
    
};

#endif /* defined(__Ribbons03__InkDrop__) */
