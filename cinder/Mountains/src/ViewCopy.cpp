//
//  ViewCopy.cpp
//  Mountains
//
//  Created by Yiwen on 25/07/2014.
//
//

#include "ViewCopy.h"
#include "MeshUtils.h"

ViewCopy::ViewCopy() : View("shaders/copy.vert", "shaders/copy.frag") {
    _init();
}

ViewCopy::ViewCopy(string vsPath, string fsPath) : View(vsPath, fsPath) {
    _init();
}


void ViewCopy::_init() {
    mesh = bongiovi::MeshUtils::createPlane(2, 1);
}

void ViewCopy::render(gl::TextureRef texture) {
    render(*texture);
}

void ViewCopy::render(gl::Texture texture) {
    shader->bind();
    shader->uniform("texture", 0);
    texture.bind();
    gl::draw(mesh);
    texture.unbind();
    shader->unbind();
}