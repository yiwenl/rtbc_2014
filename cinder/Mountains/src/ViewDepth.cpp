//
//  ViewDepth.cpp
//  Mountains
//
//  Created by Yiwen on 31/07/2014.
//
//

#include "ViewDepth.h"
#include "MeshUtils.h"

using namespace bongiovi;

ViewDepth::ViewDepth() : View("shaders/copy.vert", "shaders/depth.frag") {
    _init();
}

ViewDepth::ViewDepth(string vsPath, string fsPath) : View(vsPath, fsPath) {
    _init();
}


void ViewDepth::_init() {
    mesh = MeshUtils::createPlane(2, 1);
}


void ViewDepth::render(gl::Texture texture, gl::Texture textureDepth, gl::Texture textureSSAO) {
    shader->bind();
    shader->uniform("texture", 0);
    shader->uniform("textureDepth", 1);
    shader->uniform("textureSSAO", 2);
    texture.bind(0);
    textureDepth.bind(1);
    textureSSAO.bind(2);
    gl::draw(mesh);
    texture.unbind();
    textureDepth.unbind();
    textureSSAO.unbind();
    shader->unbind();
}