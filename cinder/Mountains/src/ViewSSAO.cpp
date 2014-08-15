//
//  ViewSSAO.cpp
//  Mountains
//
//  Created by Yiwen on 15/08/2014.
//
//

#include "ViewSSAO.h"

ViewSSAO::ViewSSAO() : ViewCopy("shaders/copy.vert", "shaders/ssao.frag"){
}

ViewSSAO::ViewSSAO(string vsPath, string fsPath) : ViewCopy(vsPath, fsPath) {
//    _init();
}



void ViewSSAO::render(gl::Texture texture) {
    shader->bind();
    shader->uniform("texture", 0);
    shader->uniform("textureDepth", 1);
    _texRandom.bind(0);
    texture.bind(1);
    gl::draw(mesh);
    texture.unbind();
    _texRandom.unbind();
    shader->unbind();
}