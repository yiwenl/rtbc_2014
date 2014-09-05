//
//  ViewPost.cpp
//  CalligraphyTouch
//
//  Created by Yiwen on 22/07/2014.
//
//

#include "ViewPost.h"
#include "MeshUtils.h"

using namespace bongiovi;

ViewPost::ViewPost() :View("shaders/copy.vert", "shaders/post.frag") {
    _init();
}

ViewPost::ViewPost(string vsPath, string fsPath) : View(vsPath, fsPath) {
    _init();
}


void ViewPost::_init() {
    mesh = MeshUtils::createPlane(2, 1);
}


void ViewPost::render(gl::Texture stroke, gl::Texture vid, gl::TextureRef bg, bool addVideo) {
    shader->bind();
    shader->uniform("texture", 0);
    shader->uniform("textureVid", 1);
    shader->uniform("textureBg", 2);
    shader->uniform("dimension", Vec2f(1024.0f, 1024.0f));
    shader->uniform("addVideo", addVideo);
    stroke.bind(0);
    vid.bind(1);
    bg->bind(2);
    gl::draw(mesh);
    stroke.unbind();
    vid.unbind();
    bg->unbind();
    shader->unbind();
}