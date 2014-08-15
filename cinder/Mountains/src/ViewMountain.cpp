//
//  ViewMountain.cpp
//  Mountains
//
//  Created by Yiwen on 23/07/2014.
//
//

#include "ViewMountain.h"
#include "MeshUtils.h"
#include "MathUtils.h"

using namespace bongiovi;
using namespace bongiovi::utils;

ViewMountain::ViewMountain(Vec3f mLoc, float mSize, float mHeight) : View("shaders/mountain.vert", "shaders/mountain.frag"),
location(mLoc),
size(mSize),
height(mHeight) {
    _init();
}

ViewMountain::ViewMountain(string vsPath, string fsPath, Vec3f mLoc, float mSize, float mHeight) : View(vsPath, fsPath),
location(mLoc),
size(mSize),
height(mHeight)
{
    _init();
}


void ViewMountain::_init() {
    texIndex    = rand() % 34;
    _power      = 1 + rand() % 2;
    int seed    = rand();
    cout << "Seed : " << seed << endl;
    _perlin     = new Perlin(4, seed);
    
    gl::VboMesh::Layout layout;
    layout.setStaticIndices();
    layout.setStaticTexCoords2d();
    layout.setStaticPositions();
    layout.setStaticNormals();
    
    vector<uint> indices;
    vector<Vec3f> positions;
    vector<Vec3f> normals;
    vector<Vec2f> coords;
    
    int i, j, count = 0;
    float numSeg = 25;
    float segSize = size/(float)numSeg;
    float uvBase = 1.0/numSeg;
    float startPos = size / 2.0f;
    float ty = -100.0f;
    
    
    for(j=0; j<numSeg; j++) {
        for(i=0; i<numSeg; i++) {
            
            positions.push_back(Vec3f(-startPos + i*segSize,       ty+_getHeight(i, j, numSeg), startPos - j*segSize));
            positions.push_back(Vec3f(-startPos + (i+1)*segSize,   ty+_getHeight(i+1, j, numSeg), startPos - j*segSize));
            positions.push_back(Vec3f(-startPos + (i+1)*segSize,   ty+_getHeight(i+1, j+1, numSeg), startPos - (j+1)*segSize));
            positions.push_back(Vec3f(-startPos + i*segSize,       ty+_getHeight(i, j+1, numSeg), startPos - (j+1)*segSize));
            
            Vec3f v1 = Vec3f(-startPos + (i+1)*segSize,   ty+_getHeight(i+1, j, numSeg), startPos - j*segSize) - Vec3f(-startPos + i*segSize,       ty+_getHeight(i, j, numSeg), startPos - j*segSize);
            Vec3f v2 = Vec3f(-startPos + i*segSize,       ty+_getHeight(i, j+1, numSeg), startPos - (j+1)*segSize) - Vec3f(-startPos + i*segSize,       ty+_getHeight(i, j, numSeg), startPos - j*segSize);
            Vec3f normal = v1.cross(v2);
            normal.normalize();
//            normal.rotateX(theta);
            
            normals.push_back(normal);
            normals.push_back(normal);
            normals.push_back(normal);
            normals.push_back(normal);
            
            coords.push_back(Vec2f(uvBase*i, uvBase*j));
            coords.push_back(Vec2f(uvBase*(i+1), uvBase*j));
            coords.push_back(Vec2f(uvBase*(i+1), uvBase*(j+1)));
            coords.push_back(Vec2f(uvBase*i, uvBase*(j+1)));
            
            
            indices.push_back(count*4+0);
            indices.push_back(count*4+1);
            indices.push_back(count*4+2);
            indices.push_back(count*4+0);
            indices.push_back(count*4+2);
            indices.push_back(count*4+3);
            
            count++;
        }
    }

    mesh = gl::VboMesh(positions.size(), indices.size(), layout, GL_TRIANGLES);
    mesh.bufferPositions(positions);
    mesh.bufferIndices(indices);
    mesh.bufferNormals(normals);
    mesh.bufferTexCoords2d(0, coords);

}

float ViewMountain::_getHeight(int i, int j, int numSeg) {
    float perlinOffset = .2f;
    float perlinHeight = height*.25;
    float maxHeight = height;
    float power = _power;
    float off0 = sin((float)i/numSeg*M_PI);
    float off1 = sin((float)j/numSeg*M_PI);
    float offset = off0 * off1;
    offset = pow(offset, power);
    float noiseHeight = _perlin->noise(i*perlinOffset, j*perlinOffset) * perlinHeight * offset;
    return offset * maxHeight + noiseHeight;
}


void ViewMountain::render(gl::TextureRef texture) {
    shader->bind();
    shader->uniform("texture", 0);
    shader->uniform("location", location);
    texture->bind();
    gl::draw(mesh);
    texture->unbind();
    shader->unbind();
}