uniform sampler2D   texture;

#define focus       .3
#define PI          3.1415926
#define PI2         1.5707

float contrast(float value, float scale) {
    float nValue = (value-.5) * scale + .5;
    nValue = min(max(nValue, 0.0), 1.0);
    return nValue;
}

vec3 contrast(vec3 color, float scale) {
    return vec3(contrast(color.r, scale), contrast(color.g, scale), contrast(color.b, scale) );
}

void main(void) {
    vec2 texCoord   = gl_TexCoord[0].st;
    texCoord.y      = 1.0 - texCoord.y;
    float z         = texture2D(texture, texCoord).x;
    float n         = 5.0;
    float f         = 2000.0;
    float depth     = (2.0 * n) / (f + n - z*(f-n));
//    gl_FragColor    = vec4(1.0, 0.0, 0.0, 1.0);
    depth           = contrast(depth, 3.0);
    gl_FragColor    = vec4(depth, depth, depth, 1.0);
    
//    depth           = sin(depth * PI2);
//    depth           = 1.0 - cos(depth * PI2);
}