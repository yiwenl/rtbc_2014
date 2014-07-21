//
//  ViewCopy.h
//  Ribbons03
//
//  Created by Yiwen on 18/07/2014.
//
//

#ifndef __Ribbons03__ViewCopy__
#define __Ribbons03__ViewCopy__

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

#endif /* defined(__Ribbons03__ViewCopy__) */
