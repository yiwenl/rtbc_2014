#version 120

uniform sampler2D   texture;
uniform sampler2D   textureDepth;


float rand(vec2 co)
{
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

int randInt(int start, int end)
{
    return int(fract(sin(dot(vec2(start, end),vec2(12.9898,78.233))) * 43758.5453));
}

float contrast(float value, float scale) {
    float nValue = (value-.5) * scale + .5;
    nValue = min(max(nValue, 0.0), 1.0);
    return nValue;
}


vec3 contrast(vec3 color, float scale) {
    return vec3(contrast(color.r, scale), contrast(color.g, scale), contrast(color.b, scale) );
}


float map(float value, float sx, float sy, float tx, float ty) {
    float per = (value - sx) / (sy - sx);
    float final =  tx + ( ty - tx ) * per;
    return min(max(final, 0.0), 1.0);
}

vec3 map(vec3 value, float sx, float sy, float tx, float ty) {
    return vec3( map(value.x, sx, sy, tx, ty), map(value.y, sx, sy, tx, ty), map(value.z, sx, sy, tx, ty));
}

vec4 map(vec4 value, float sx, float sy, float tx, float ty) {
    return vec4( map(value.xyz, sx, sy, tx, ty), map(value.w, sx, sy, tx, ty));
}



#define focus       .3
#define PI          3.1415926
#define PI2         1.5707


//may have to change these as they are generally scene-dependent ( to get the look you want )
const float totStrength = 0.38;
const float strength = 0.3;
const float offset = 0.002;
const float falloff = 0.0;
const float rad = 0.03;

#define SAMPLES 10 // 10 is good
const float invSamples = -0.5/10.0;


void main(void) {
    vec2 uv   = gl_TexCoord[0].st;
    uv.y      = 1.0 - uv.y;
    
    vec3 pSphere[10];
    pSphere[0] = vec3(0.13790712, 0.24864247, 0.44301823);
    pSphere[1] = vec3(0.33715037, 0.56794053, -0.005789503);
    pSphere[2] = vec3(0.06896307, -0.15983082, -0.85477847);
    pSphere[3] = vec3(-0.014653638, 0.14027752, 0.0762037);
    pSphere[4] = vec3(0.010019933, -0.1924225, -0.034443386);
    pSphere[5] = vec3(-0.35775623, -0.5301969, -0.43581226);
    pSphere[6] = vec3(-0.3169221, 0.106360726, 0.015860917);
    pSphere[7] = vec3(0.010350345, -0.58698344, 0.0046293875);
    pSphere[8] = vec3(-0.053382345, 0.059675813, -0.5411899);
    pSphere[9] = vec3(0.035267662, -0.063188605, 0.54602677);
    
    
    //grab a normal for reflecting the sample rays later on
    vec3 fres = normalize((texture2D(texture,rand(uv) * offset * uv).xyz*2.0) - vec3(1.0));
    
    vec4 currentPixelSample = texture2D(textureDepth, uv);
//    currentPixelSample      = map( currentPixelSample, .3, .7, 0.0, 1.0);
    currentPixelSample.rgb  = contrast(currentPixelSample.rgb, 10.0);
//    currentPixelSample.rgb  = 1.0 - cos(currentPixelSample.rgb * PI2);
    currentPixelSample.a    = currentPixelSample.r;
    
    float currentPixelDepth = currentPixelSample.a;
    
    // current fragment coords in screen space
    vec3 ep = vec3(uv.xy,currentPixelDepth);
    
    // get the normal of current fragment
    vec3 norm = currentPixelSample.xyz;
    
    float bl = 0.0;
    
    // adjust for the depth ( not sure if this is good..)
    //float radD = rad/currentPixelDepth;
    
    //vec3 ray, se, occNorm;
    float occluderDepth, depthDifference;
    vec4 occluderFragment;
    vec3 ray;
    
    for(int i=0; i<SAMPLES;++i)
    {
        // get a vector (randomized inside of a sphere with radius 1.0) from a texture and reflect it
        ray = rad*reflect(pSphere[i],fres);
        
        // if the ray is outside the hemisphere then change direction
        //se = ep + sign(dot(ray,norm) )*rad*reflect(pSphere[i],fres).xy;
        
        // get the depth of the occluder fragment
        vec2 something = ep.xy + sign(dot(ray,norm) )*ray.xy;
        occluderFragment = texture2D(textureDepth, something );
        
        // get the normal of the occluder fragment
        //occNorm = occluderFragment.xyz;
        
        // if depthDifference is negative = occluder is behind current fragment
        depthDifference = currentPixelDepth-occluderFragment.a;
//        depthDifference = pow(depthDifference, 5.0);
        
        // calculate the difference between the normals as a weight
        
        //normDiff = (1.0-dot(occluderFragment.xyz,norm)); // used to be 1.0 -
        
        // the falloff equation, starts at falloff and is kind of 1/x^2 falling
        bl += step(falloff,depthDifference)*(1.0-dot(occluderFragment.xyz,norm))*(1.0-smoothstep(falloff,strength,depthDifference));
    }
    
    // output the result
    gl_FragColor = vec4(1.0);
    gl_FragColor.r = bl*invSamples;
//    gl_FragColor.a = 1.0;
//    gl_FragColor.gb = vec2(1.0);
//    gl_FragColor.a = currentPixelDepth; //using depth to set a water fog depth for later use
}