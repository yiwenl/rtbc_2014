uniform sampler2D   texture;
uniform vec2        uvOffset;
uniform float       uvGap;

void main(void) {
    vec2 texCoord       = gl_TexCoord[0].st;
    texCoord            *= uvGap;
    texCoord            += uvOffset;
    gl_FragColor        = texture2D(texture, texCoord);
    gl_FragColor.rgb    = vec3(.5);
//    gl_FragColor    = vec4(1.0);
}