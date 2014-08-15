uniform vec2    location;
uniform float   ratio;

#define radius  .05

void main(void) {
    vec2 texCoord   = gl_TexCoord[0].st;
    gl_FragColor    = vec4(0.0, 0.0, 0.0, 1.0);
    
//    texCoord.y      = (texCoord.y-.5)/ratio + .5;
    if( length(texCoord - location) < radius) gl_FragColor.r = 1.0;
}