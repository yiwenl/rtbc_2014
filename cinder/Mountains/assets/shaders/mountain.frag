uniform sampler2D   texture;
varying vec3        vNormal;
varying float       vHeightOffset;

#define threshold   .7
#define PI          3.1415926

void main(void) {
    vec2 texCoord   = gl_TexCoord[0].st;
    vec4 color      = texture2D(texture, texCoord);
    gl_FragColor    = color;
    vec2 center     = vec2(.5);
    float offset    = length(texCoord - center);
    offset          = offset/.5;
    if(offset > 1.0) offset = 1.0;
    float alpha     = vHeightOffset;
    
    gl_FragColor.a      *= alpha;
//    gl_FragColor.rgb    *= brightness;
    
    //  LIGHTINGS
//    
//    vec3 lightDir       = vec3(1.0, 1.0, 0.0);
//    lightDir            = normalize(lightDir);
//    vec3 lightColor     = vec3(1);
//    vec3 ambientColor   = vec3(.2);
//    float lightWeight   = 0.8;
//    
//    gl_FragColor.rgb    *= ambientColor;
//    float dotLight      = dot(lightDir, vNormal);
//    if(dotLight < .0)    dotLight = .0;
//    vec3 lightAmount    = lightColor * dotLight * lightWeight;
//    lightAmount         *= color.rgb;
//    gl_FragColor.rgb    += lightAmount;
}