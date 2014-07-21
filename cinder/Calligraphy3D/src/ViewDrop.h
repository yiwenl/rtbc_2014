//
//  ViewDrop.h
//  Ribbons03
//
//  Created by Yiwen on 19/07/2014.
//
//

#ifndef __Ribbons03__ViewDrop__
#define __Ribbons03__ViewDrop__

#include <iostream>
#include "cinder/gl/Texture.h"
#include "View.h"
#include "InkDrop.h"

using namespace bongiovi;

class ViewDrop : public View {
public:
    ViewDrop();
    ViewDrop(gl::TextureRef);
    ViewDrop(string vsPath, string fsPath, gl::TextureRef);
    void                    render();
    void                    render(InkDrop*, gl::TextureRef);
    int                     currframe = 0;
    
private:
    void                    _init();
    gl::TextureRef          _texture;
    
};

#endif /* defined(__Ribbons03__ViewDrop__) */
