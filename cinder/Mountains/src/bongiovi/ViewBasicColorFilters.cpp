//
//  ViewBasicColorFilters.cpp
//  NikeCityAttack
//
//  Created by Yiwen on 11/08/2014.
//
//

#include "ViewBasicColorFilters.h"


ViewContrast::ViewContrast() : ViewCopy("shaders/copy.vert", "shaders/contrast.frag") { }

ViewContrast::ViewContrast(string vsPath, string fsPath) : ViewCopy(vsPath, fsPath) { }


void ViewContrast::render(gl::Texture texture) {
    shader->bind();
    shader->uniform("texture", 0);
    shader->uniform("contrast", contrast);
    texture.bind();
    gl::draw(mesh);
    texture.unbind();
    shader->unbind();
}




ViewBrightness::ViewBrightness() : ViewCopy("shaders/copy.vert", "shaders/brightness.frag") { }

ViewBrightness::ViewBrightness(string vsPath, string fsPath) : ViewCopy(vsPath, fsPath) { }


void ViewBrightness::render(gl::Texture texture) {
    shader->bind();
    shader->uniform("texture", 0);
    shader->uniform("contrast", brightness);
    texture.bind();
    gl::draw(mesh);
    texture.unbind();
    shader->unbind();
}




ViewSaturation::ViewSaturation() : ViewCopy("shaders/copy.vert", "shaders/saturation.frag") { }

ViewSaturation::ViewSaturation(string vsPath, string fsPath) : ViewCopy(vsPath, fsPath) { }


void ViewSaturation::render(gl::Texture texture) {
    shader->bind();
    shader->uniform("texture", 0);
    shader->uniform("contrast", saturation);
    texture.bind();
    gl::draw(mesh);
    texture.unbind();
    shader->unbind();
}



ViewCurve::ViewCurve() : ViewCopy("shaders/copy.vert", "shaders/curve.frag") { }

ViewCurve::ViewCurve(string vsPath, string fsPath) : ViewCopy(vsPath, fsPath) { }

void ViewCurve::setCurveTexture(gl::Texture texture) {
    _textureCurve = texture;
}

void ViewCurve::render(gl::Texture texture) {
    shader->bind();
    shader->uniform("texture", 0);
    shader->uniform("textureCurve", 1);
    shader->uniform("offset", offset);
    texture.bind(0);
    _textureCurve.bind(1);
    gl::draw(mesh);
    texture.unbind();
    _textureCurve.unbind();
    shader->unbind();
}



ViewGradientMap::ViewGradientMap() : ViewCopy("shaders/copy.vert", "shaders/gradientMap.frag") { }

ViewGradientMap::ViewGradientMap(string vsPath, string fsPath) : ViewCopy(vsPath, fsPath) { }

void ViewGradientMap::setMapTexture(gl::Texture texture) {
    _textureCurve = texture;
}

void ViewGradientMap::render(gl::Texture texture) {
    shader->bind();
    shader->uniform("texture", 0);
    shader->uniform("textureMap", 1);
    shader->uniform("offset", offset);
    texture.bind(0);
    _textureCurve.bind(1);
    gl::draw(mesh);
    texture.unbind();
    _textureCurve.unbind();
    shader->unbind();
}



ViewOverlay::ViewOverlay() : ViewCopy("shaders/copy.vert", "shaders/overlay.frag") { }

ViewOverlay::ViewOverlay(string vsPath, string fsPath) : ViewCopy(vsPath, fsPath) { }

void ViewOverlay::setOverlayTexture(gl::Texture texture) {
    _textureOverlay = texture;
}

void ViewOverlay::render(gl::Texture texture) {
    shader->bind();
    shader->uniform("texture", 0);
    shader->uniform("textureOverlay", 1);
    shader->uniform("offset", offset);
    texture.bind(0);
    _textureOverlay.bind(1);
    gl::draw(mesh);
    texture.unbind();
    _textureOverlay.unbind();
    shader->unbind();
}