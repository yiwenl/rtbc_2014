uniform float ratio;

void main() {
    gl_FrontColor   = gl_Color;
    gl_TexCoord[0]  = gl_MultiTexCoord0;
    vec4 pos        = gl_Vertex;
    pos.x           /= ratio;
    pos.y           -= .35;

    gl_Position     = gl_ModelViewProjectionMatrix * pos;
}