uniform float size;
uniform vec3 location;
uniform float rotation;

vec3 rotateZ(vec3 pos, float alpha) {
    mat4 trans= mat4(   cos(alpha), -sin(alpha), 0.0, 0.0,
                     sin(alpha), cos(alpha), 0.0, 0.0,
                     0.0, 0.0, 1.0, 0.0,
                     0.0, 0.0, 0.0, 1.0);
    return vec3(trans * vec4(pos, 1.0));
}


void main() {
    gl_FrontColor   = gl_Color;
    gl_TexCoord[0]  = gl_MultiTexCoord0;
    vec4 pos        = gl_Vertex;
    
    pos.xy          *= size;
    pos.xyz         = rotateZ(pos.xyz, rotation);
    pos.xyz         += location;
    
    gl_Position     = gl_ModelViewProjectionMatrix * pos;
}