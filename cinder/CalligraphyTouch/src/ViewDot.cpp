//
//  ViewDot.cpp
//  CalligraphyTouch
//
//  Created by Yiwen on 03/08/2014.
//
//

#include "ViewDot.h"
#include "MeshUtils.h"

using namespace bongiovi;

ViewDot::ViewDot() : View("shaders/copy.vert", "shaders/dot.frag") {
    _init();
}

ViewDot::ViewDot(string vsPath, string fsPath) : View(vsPath, fsPath) {
    _init();
}


void ViewDot::_init() {
    mesh = MeshUtils::createPlane(2, 1);
}


void ViewDot::render() {
    shader->bind();
    shader->uniform("location", Vec2f(.5, .5));
    shader->uniform("ratio", ci::app::getWindowAspectRatio() );
    gl::draw(mesh);
    shader->unbind();
}


void ViewDot::render(Vec2f vec) {
    shader->bind();
    shader->uniform("location", vec);
    shader->uniform("ratio", ci::app::getWindowAspectRatio() );
    gl::draw(mesh);
    shader->unbind();
}