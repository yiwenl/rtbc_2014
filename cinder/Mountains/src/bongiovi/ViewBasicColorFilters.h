//
//  ViewBasicColorFilters.h
//  NikeCityAttack
//
//  Created by Yiwen on 11/08/2014.
//
//

#ifndef __NikeCityAttack__ViewBasicColorFilters__
#define __NikeCityAttack__ViewBasicColorFilters__

#include <iostream>
#include "cinder/gl/Texture.h"
#include "ViewCopy.h"

using namespace bongiovi;

class ViewContrast : public ViewCopy {
public:
    ViewContrast();
    ViewContrast(string vsPath, string fsPath);
    float                   contrast = 1.0;
    void                    render(gl::Texture);
};


class ViewBrightness : public ViewCopy {
public:
    ViewBrightness();
    ViewBrightness(string vsPath, string fsPath);
    float                   brightness = 1.0;
    void                    render(gl::Texture);
};


class ViewSaturation : public ViewCopy {
public:
    ViewSaturation();
    ViewSaturation(string vsPath, string fsPath);
    float                   saturation = 1.0;
    void                    render(gl::Texture);
};


class ViewCurve : public ViewCopy {
public:
    ViewCurve();
    ViewCurve(string vsPath, string fsPath);
    void                    setCurveTexture(gl::Texture);
    void                    render(gl::Texture);
    float                   offset = .5;
    
private:
    gl::Texture             _textureCurve;
};


class ViewGradientMap : public ViewCopy {
public:
    ViewGradientMap();
    ViewGradientMap(string vsPath, string fsPath);
    void                    setMapTexture(gl::Texture);
    void                    render(gl::Texture);
    float                   offset = .5;
    
private:
    gl::Texture             _textureCurve;
};



class ViewOverlay : public ViewCopy {
public:
    ViewOverlay();
    ViewOverlay(string vsPath, string fsPath);
    void                    setOverlayTexture(gl::Texture);
    void                    render(gl::Texture);
    float                   offset = .5;
    
private:
    gl::Texture             _textureOverlay;
};


#endif /* defined(__NikeCityAttack__ViewBasicColorFilters__) */
