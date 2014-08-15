uniform vec3        location;
varying vec3        vNormal;
varying float       vHeightOffset;


#define heightFade  10.0

void main() {
    gl_FrontColor   = gl_Color;
    gl_TexCoord[0]  = gl_MultiTexCoord0;
    vec4 pos        = gl_Vertex;
    pos.xyz         += location;
    vNormal         = gl_Normal;
    vHeightOffset   = (pos.y+100.0) > heightFade ? 1.0 : (pos.y+100.0) / heightFade;
    

    gl_Position     = gl_ModelViewProjectionMatrix * pos;
}