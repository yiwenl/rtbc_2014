uniform sampler2D   texture;

void main(void) {
    
    vec2 texCoord   = gl_TexCoord[0].st;
    texCoord.y      = 1.0 - texCoord.y;
    gl_FragColor    = texture2D(texture, texCoord);
}