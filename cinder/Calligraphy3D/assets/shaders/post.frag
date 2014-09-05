uniform sampler2D       texture;
uniform sampler2DRect   textureVid;
uniform sampler2D       textureBg;
uniform vec2            dimension;
uniform bool            addVideo;


float overlay(float a, float b) {
    if(a < .5) return 2.0 * a * b;
    else return 1.0 - 2.0*(1.0 - a) * ( 1.0 -b);
}

vec3 overlay(vec3 a, vec3 b) {
    return vec3(overlay(a.r, b.r), overlay(a.r, b.r), overlay(a.r, b.r));
}


vec3 greyStyle(vec3 color) {
    float grey = (color.r + color.g + color.b ) / 3.0;
    return vec3(grey);
}


void main(void) {
    vec2 texCoord       = gl_TexCoord[0].st;
    vec2 texCoordVid    = texCoord * dimension;
    
    vec4 colorStroke    = texture2D(texture, texCoord);
    vec4 colorVideo     = addVideo ? texture2DRect(textureVid, texCoordVid) : vec4(1.0);
    vec4 colorBg        = texture2D(textureBg, texCoord);
    colorVideo.rgb      = overlay(colorVideo.rgb, colorBg.rgb);
    
    
    gl_FragColor        = colorStroke * colorVideo;
//    gl_FragColor.rgb    = overlay(gl_FragColor.rgb, colorBg.rgb);l
//    gl_FragColor.rgb    = overlay(colorBg.rgb, gl_FragColor.rgb);
}