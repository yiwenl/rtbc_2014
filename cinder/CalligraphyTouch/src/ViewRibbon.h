//
//  ViewRibbon.h
//  Ribbons03
//
//  Created by Yiwen on 18/07/2014.
//
//

#ifndef __Ribbons03__ViewRibbon__
#define __Ribbons03__ViewRibbon__

#include <iostream>
#include "cinder/gl/Texture.h"
#include "View.h"

using namespace bongiovi;

class ViewRibbon : public View {
public:
    ViewRibbon();
    ViewRibbon(int);
    ViewRibbon(string vsPath, string fsPath);
    void                    render();
    void                    render(gl::TextureRef);
    void                    update();
    int                     textureIndex;
    
private:
    void                    _init();
};

#endif /* defined(__Ribbons03__ViewRibbon__) */
