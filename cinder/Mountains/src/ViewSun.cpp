//
//  ViewSun.cpp
//  Mountains
//
//  Created by Yiwen on 15/08/2014.
//
//

#include "ViewSun.h"
#include "MeshUtils.h"

ViewSun::ViewSun() : View("shaders/sun.vert", "shaders/copy.frag") {
    _init();
}

ViewSun::ViewSun(string vsPath, string fsPath) : View(vsPath, fsPath) {
    _init();
}


void ViewSun::_init() {
    float size = 2.0;
    mesh = MeshUtils::createPlane(size, 1);
}


void ViewSun::render(gl::Texture texture) {
    shader->bind();
    shader->uniform("texture", 0);
    shader->uniform("ratio", ci::app::getWindowAspectRatio());
    texture.bind(0);
    gl::draw(mesh);
    texture.unbind();
    shader->unbind();
}