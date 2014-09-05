//
//  ViewRibbon.cpp
//  Ribbons03
//
//  Created by Yiwen on 18/07/2014.
//
//

#include "ViewRibbon.h"
#include "GlobalSettings.h"
#include "MathUtils.h"

using namespace ci;
using namespace std;

ViewRibbon::ViewRibbon() : View("shaders/copy.vert", "shaders/strokes.frag") {
    _init();
}

ViewRibbon::ViewRibbon(int index) : View("shaders/copy.vert", "shaders/strokes.frag") {
    textureIndex = index;
    _init();
}

ViewRibbon::ViewRibbon(string vsPath, string fsPath) : View(vsPath, fsPath) {
    _init();
}


void ViewRibbon::_init() {
    theta       = bongiovi::utils::MathUtils::random(M_PI * 2.0);
    angleScale  = bongiovi::utils::MathUtils::random(1.0, 4.0);
}


void ViewRibbon::update() {
    gl::VboMesh::Layout layout;
    layout.setStaticIndices();
    layout.setStaticTexCoords2d();
    layout.setStaticPositions();
    
    vector<uint> indices;
    vector<Vec3f> positions;
    vector<Vec2f> coords;
    
    Vec3f p0, p1, yAxis0, yAxis1;
    int count = 0;
    float total = GlobalSettings::getInstance().pointsSpline.size();
    for( int i=0; i<total-1; i++) {
        p0          = GlobalSettings::getInstance().pointsSpline[i];
        p1          = GlobalSettings::getInstance().pointsSpline[i+1];
        yAxis0      = GlobalSettings::getInstance().points[i] * GlobalSettings::getInstance().ribbonWidth;
        yAxis1      = GlobalSettings::getInstance().points[i+1] * GlobalSettings::getInstance().ribbonWidth;
        float offset = sin(i/(total+1) * M_PI * angleScale + theta);
        offset      = (offset + 1.0) * .5;
        offset      = offset * .9 + .1;
        
        positions.push_back(p0 + yAxis0*offset);
        positions.push_back(p1 + yAxis1*offset);
        positions.push_back(p1 - yAxis1*offset);
        positions.push_back(p0 - yAxis0*offset);
        
        coords.push_back(Vec2f(i/total, 0));
        coords.push_back(Vec2f((i+1)/total, 0));
        coords.push_back(Vec2f((i+1)/total, 1));
        coords.push_back(Vec2f(i/total, 1));
        
        indices.push_back(count*4+0);
        indices.push_back(count*4+1);
        indices.push_back(count*4+2);
        indices.push_back(count*4+0);
        indices.push_back(count*4+2);
        indices.push_back(count*4+3);
        
        count++;
    }
    
    mesh = gl::VboMesh(positions.size(), indices.size(), layout, GL_TRIANGLES);
    mesh.bufferPositions(positions);
    mesh.bufferIndices(indices);
    mesh.bufferTexCoords2d(0, coords);
}


void ViewRibbon::render(gl::TextureRef texture) {
    if(!mesh) return;
    shader->bind();
    shader->uniform("texture", 0);
    shader->uniform("isInDark", GlobalSettings::getInstance().isInDark);
    texture->bind();
    gl::draw(mesh);
    texture->unbind();
    shader->unbind();
}


void ViewRibbon::render(gl::TextureRef texture, int state) {
    if(!mesh) return;
    if(state == 0 || state == 4) {
        shader->bind();
        shader->uniform("texture", 0);
    }
    shader->uniform("isInDark", GlobalSettings::getInstance().isInDark);
    texture->bind();
    gl::draw(mesh);
    texture->unbind();
    if(state == 2 || state == 4) shader->unbind();
}