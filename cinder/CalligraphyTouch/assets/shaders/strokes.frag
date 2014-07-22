uniform sampler2D   texture;
uniform bool        isInDark;

void main(void) {
    vec2 texCoord   = gl_TexCoord[0].st;
    gl_FragColor    = texture2D(texture, texCoord);
    if(isInDark) gl_FragColor.rgb = vec3(.93, .768, .439) * length(gl_FragColor.rgb);
}