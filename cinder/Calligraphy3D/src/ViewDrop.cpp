//
//  ViewDrop.cpp
//  Ribbons03
//
//  Created by Yiwen on 19/07/2014.
//
//

#include "ViewDrop.h"


ViewDrop::ViewDrop() : View("shaders/drop.vert", "shaders/drop.frag"){
    _init();
}
    
ViewDrop::ViewDrop(gl::TextureRef texture) : View("shaders/copy.vert", "shaders/drop.frag"), _texture(texture) {
    _init();
}

ViewDrop::ViewDrop(string vsPath, string fsPath, gl::TextureRef texture) : View(vsPath, fsPath) {
    _texture = texture;
    _init();
}


void ViewDrop::_init() {
    gl::VboMesh::Layout layout;
    layout.setStaticIndices();
    layout.setStaticTexCoords2d();
    layout.setStaticPositions();
    
    vector<uint> indices;
    vector<Vec3f> positions;
    vector<Vec2f> coords;

    float size = 1.0f;
    positions.push_back(Vec3f(-size,  size, 0));
    positions.push_back(Vec3f( size,  size, 0));
    positions.push_back(Vec3f( size, -size, 0));
    positions.push_back(Vec3f(-size, -size, 0));
    
    coords.push_back(Vec2f(0, 0));
    coords.push_back(Vec2f(1, 0));
    coords.push_back(Vec2f(1, 1));
    coords.push_back(Vec2f(0, 1));
    
    
    indices.push_back(0);
    indices.push_back(1);
    indices.push_back(2);
    indices.push_back(0);
    indices.push_back(2);
    indices.push_back(3);
    
    mesh = gl::VboMesh(positions.size(), indices.size(), layout, GL_TRIANGLES);
    mesh.bufferPositions(positions);
    mesh.bufferIndices(indices);
    mesh.bufferTexCoords2d(0, coords);
}

void ViewDrop::render(InkDrop* ink, gl::TextureRef texture) {
    Vec2f uvOffset = ink->update();
    shader->bind();
    shader->uniform("texture", 0);
    shader->uniform("size", ink->size);
    shader->uniform("location", ink->loc);
    shader->uniform("uvGap", ink->uvGap);
    shader->uniform("uvOffset", uvOffset);
    texture->bind();
    gl::draw(mesh);
    texture->unbind();
    shader->unbind();

}

void ViewDrop::render() {
    Vec2f uvOffset(0, 0);
    uvOffset.x = (currframe % 4) * .25;
    uvOffset.y = floor(currframe / 4) * .25;
    
    shader->bind();
    shader->uniform("texture", 0);
    shader->uniform("uvOffset", uvOffset);
    _texture->bind();
    gl::draw(mesh);
    _texture->unbind();
    shader->unbind();
    
    currframe ++;
    if(currframe >= 16) currframe = 0;

}