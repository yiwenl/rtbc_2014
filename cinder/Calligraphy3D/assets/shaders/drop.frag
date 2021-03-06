uniform sampler2D   texture;
uniform vec2        uvOffset;
uniform float       uvGap;
uniform bool        isInDark;

void main(void) {
    vec2 texCoord       = gl_TexCoord[0].st;
    texCoord            *= uvGap;
    texCoord            += uvOffset;
    gl_FragColor        = texture2D(texture, texCoord);
    
    if(isInDark)        gl_FragColor.rgb = vec3(.93, .768, .439)*1.1;
    else                gl_FragColor.rgb = vec3(.5);
}