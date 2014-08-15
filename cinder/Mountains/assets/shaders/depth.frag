uniform sampler2D   texture;
uniform sampler2D   textureDepth;
uniform sampler2D   textureSSAO;


vec4 Desaturate(vec3 color, float Desaturation)
{
	vec3 grayXfer = vec3(0.3, 0.59, 0.11);
	vec3 gray = vec3(dot(grayXfer, color));
	return vec4(mix(color, gray, Desaturation), 1.0);
}

vec3 greyScale(vec3 color) {
    float grey = (color.r + color.g + color.b) / 3.0;
    return vec3(grey);
}

float contrast(float value, float scale) {
    float nValue = (value-.5) * scale + .5;
    nValue = min(max(nValue, 0.0), 1.0);
    return nValue;
}

vec3 contrast(vec3 color, float scale) {
    return vec3(contrast(color.r, scale), contrast(color.g, scale), contrast(color.b, scale) );
}

vec3 brightness(vec3 color, float scale) {
    return color * scale;
}


#define focus       .3
#define PI          3.1415926
#define PI2         1.5707

void main(void) {
    vec2 texCoord   = gl_TexCoord[0].st;
    texCoord.y      = 1.0 - texCoord.y;
    vec4 color      = texture2D(texture, texCoord);
    vec4 colorSSAO  = texture2D(textureSSAO, texCoord);
    float z         = texture2D(textureDepth, texCoord).x;
    float n         = 5.0;
    float f         = 2000.0;
    float depth     = (2.0 * n) / (f + n - z*(f-n));
    depth           = contrast(depth, 3.0);
//    vec3 toAdd      = vec3(.3) * (depth < .5 ? 0.0 : (depth-.5) * 2.0 );
    vec3 toAdd      = vec3(.3) * sin(depth*PI2);
    
    depth           = sin(depth * PI2);
    depth           = 1.0 - cos(depth * PI2);
    
    
    vec3 colorGrey  = Desaturate(color.rgb, 1.0).rgb;
    colorGrey       = contrast(colorGrey, 0.1);
    color.rgb       = mix(color.rgb, colorGrey, depth);
    color.rgb       += toAdd*.65;
    gl_FragColor    = color;
    gl_FragColor.a  -= toAdd.r * 1.5;
    
    float ssaoOffset = 1.0 - colorSSAO.r;
    gl_FragColor.rgb -= vec3(ssaoOffset)*1.5;
//    gl_FragColor -= vec4(ssaoOffset)*1.5;
}