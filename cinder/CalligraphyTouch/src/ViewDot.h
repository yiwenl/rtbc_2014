//
//  ViewDot.h
//  CalligraphyTouch
//
//  Created by Yiwen on 03/08/2014.
//
//

#ifndef __CalligraphyTouch__ViewDot__
#define __CalligraphyTouch__ViewDot__

#include <iostream>
#include "View.h"

using namespace bongiovi;

class ViewDot : public View {
public:
    ViewDot();
    ViewDot(string vsPath, string fsPath);
    void                    render();
    void                    render(Vec2f);
    
private:
    void                    _init();
};

#endif /* defined(__CalligraphyTouch__ViewDot__) */
