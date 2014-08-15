uniform sampler2D   texture;
uniform float       minDepth;
uniform float       contrastOffset;
//#define minDepth .5

#define ratio       1280.0/720.0
#define margin      .05


float map(float value, float sx, float sy, float tx, float ty) {
    float p = (value-sx)/(sy-sx);
    return p*(ty-tx) + tx;
}

float contrast(float value, float scale) {
    return (value-.5) * scale + .5;
}

void main(void) {
    vec2 texCoord       = gl_TexCoord[0].st;
    vec4 color          = texture2D(texture, texCoord);
    if(color.r < minDepth) gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    else {
        float d             = map(color.r, 1.0-minDepth, 1.0, 0.0, 1.0);
        d                   = contrast(d, contrastOffset);
        color.rgb           = vec3(d);
        color.a             = 1.0;
        gl_FragColor        = color;
    }
    
    if (texCoord.x < margin || texCoord.x > ( 1.0 - margin)) gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    if (texCoord.y < margin*ratio || texCoord.y > ( 1.0 - margin*ratio)) gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}