//
//  GlobalSettings.h
//  Ribbons03
//
//  Created by Yiwen on 18/07/2014.
//
//

#ifndef __Ribbons03__GlobalSettings__
#define __Ribbons03__GlobalSettings__

#include "InkDrop.h"
#include <iostream>

using namespace ci;
using namespace std;

class GlobalSettings {
    public :
    static GlobalSettings& getInstance() {
        static GlobalSettings settings;
        return settings;
    };
    
    
    float   cameraEasing                = .01;
    float   leapMotionOffset            = 2.5f;
    
    float   splineGap                   = .005;
    int     maxPoints                   = 40;
    float   minPointDistance            = 40;
    
    float   fps                         = 0;
    float   ribbonWidth                 = 30.0f;
    bool    isFlatten                   = false;
    bool    isInDark                    = false;
    
    
    vector<Vec3f>       points;
    vector<Vec3f>       pointsSpline;
    vector<InkDrop*>   inkDrops;
    
    private :
    GlobalSettings() {};
};

#endif /* defined(__Ribbons03__GlobalSettings__) */
