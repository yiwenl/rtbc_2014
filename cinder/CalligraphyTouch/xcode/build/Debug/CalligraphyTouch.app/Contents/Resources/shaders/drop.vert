uniform float size;
uniform vec3 location;

void main() {
    gl_FrontColor   = gl_Color;
    gl_TexCoord[0]  = gl_MultiTexCoord0;
    vec4 pos        = gl_Vertex;
    
    pos.xy          *= size;
    pos.xyz         += location;
    
    gl_Position     = gl_ModelViewProjectionMatrix * pos;
}