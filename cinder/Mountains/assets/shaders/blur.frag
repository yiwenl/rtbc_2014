uniform sampler2D texture;
varying vec2 vBlurTexCoords[14];

void main(void) {
    vec2 texCoord  = gl_TexCoord[0].st;
    
    gl_FragColor = vec4(0.0);
    gl_FragColor += texture2D(texture, vBlurTexCoords[ 0])*0.0044299121055113265;
    gl_FragColor += texture2D(texture, vBlurTexCoords[ 1])*0.00895781211794;
    gl_FragColor += texture2D(texture, vBlurTexCoords[ 2])*0.0215963866053;
    gl_FragColor += texture2D(texture, vBlurTexCoords[ 3])*0.0443683338718;
    gl_FragColor += texture2D(texture, vBlurTexCoords[ 4])*0.0776744219933;
    gl_FragColor += texture2D(texture, vBlurTexCoords[ 5])*0.115876621105;
    gl_FragColor += texture2D(texture, vBlurTexCoords[ 6])*0.147308056121;
    gl_FragColor += texture2D(texture, texCoord)*0.159576912161;
    gl_FragColor += texture2D(texture, vBlurTexCoords[ 7])*0.147308056121;
    gl_FragColor += texture2D(texture, vBlurTexCoords[ 8])*0.115876621105;
    gl_FragColor += texture2D(texture, vBlurTexCoords[ 9])*0.0776744219933;
    gl_FragColor += texture2D(texture, vBlurTexCoords[10])*0.0443683338718;
    gl_FragColor += texture2D(texture, vBlurTexCoords[11])*0.0215963866053;
    gl_FragColor += texture2D(texture, vBlurTexCoords[12])*0.00895781211794;
    gl_FragColor += texture2D(texture, vBlurTexCoords[13])*0.0044299121055113265;
}
