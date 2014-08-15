//
//  ViewKinectDepth.cpp
//  CalligraphyTouch
//
//  Created by Yiwen on 02/08/2014.
//
//

#include "ViewKinectDepth.h"
#include "MeshUtils.h"
#include "GlobalSettings.h"

ViewKinectDepth::ViewKinectDepth() : View("shaders/kinectDepth.vert", "shaders/kinectDepth.frag") {
    _init();
}

ViewKinectDepth::ViewKinectDepth(string vsPath, string fsPath) : View(vsPath, fsPath) {
    _init();
}


void ViewKinectDepth::_init() {
    mesh = MeshUtils::createPlane(2, 1);
}


void ViewKinectDepth::render(gl::Texture texture) {
    shader->bind();
    shader->uniform("texture", 0);
    shader->uniform("minDepth", GlobalSettings::getInstance().minDepth);
    shader->uniform("contrastOffset", GlobalSettings::getInstance().contrastOffset);
    texture.bind();
    gl::draw(mesh);
    texture.unbind();
    shader->unbind();
}