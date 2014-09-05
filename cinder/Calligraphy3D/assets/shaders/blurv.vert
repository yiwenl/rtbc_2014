varying vec2 vBlurTexCoords[14];
uniform float blurOffset;

void main(void) {
    gl_TexCoord[0]  = gl_MultiTexCoord0;
    vec2 vTextureCoord = gl_MultiTexCoord0.st;
    vec4 pos        = gl_Vertex;
    
    gl_Position     = gl_ModelViewProjectionMatrix * pos;
    vBlurTexCoords[ 0] = vTextureCoord + vec2(0.0, -0.028)*blurOffset;
    vBlurTexCoords[ 1] = vTextureCoord + vec2(0.0, -0.024)*blurOffset;
    vBlurTexCoords[ 2] = vTextureCoord + vec2(0.0, -0.020)*blurOffset;
    vBlurTexCoords[ 3] = vTextureCoord + vec2(0.0, -0.016)*blurOffset;
    vBlurTexCoords[ 4] = vTextureCoord + vec2(0.0, -0.012)*blurOffset;
    vBlurTexCoords[ 5] = vTextureCoord + vec2(0.0, -0.008)*blurOffset;
    vBlurTexCoords[ 6] = vTextureCoord + vec2(0.0, -0.004)*blurOffset;
    vBlurTexCoords[ 7] = vTextureCoord + vec2(0.0,  0.004)*blurOffset;
    vBlurTexCoords[ 8] = vTextureCoord + vec2(0.0,  0.008)*blurOffset;
    vBlurTexCoords[ 9] = vTextureCoord + vec2(0.0,  0.012)*blurOffset;
    vBlurTexCoords[10] = vTextureCoord + vec2(0.0,  0.016)*blurOffset;
    vBlurTexCoords[11] = vTextureCoord + vec2(0.0,  0.020)*blurOffset;
    vBlurTexCoords[12] = vTextureCoord + vec2(0.0,  0.024)*blurOffset;
    vBlurTexCoords[13] = vTextureCoord + vec2(0.0,  0.028)*blurOffset;
}