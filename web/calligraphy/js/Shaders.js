var shaders = {
	"shader-vs" : {
		"type" : "vertex-shader",
		"glsl" : [
                  "precision highp float;",
      		"attribute vec3 aVertexPosition;",
                  "attribute vec2 aTextureCoord;",

                  "uniform mat4 uMVMatrix;",
                  "uniform mat4 uPMatrix;",

                  "varying vec2 vTextureCoord;",

                  "void main(void) {",
                  "    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);",
                  "    vTextureCoord = aTextureCoord;",
                  "}"
		]
	},


	"shader-fs" : {
		"type" : "fragment-shader",
		"glsl" : [
                  "precision mediump float;",
                  "varying vec2 vTextureCoord;",
                  "uniform sampler2D uSampler0;",

                  "void main(void) {",
                        "gl_FragColor = texture2D(uSampler0, vec2(vTextureCoord.s, vTextureCoord.t));",
                  "}"
		]
	},


      "shader-fs-debug" : {
            "type" : "fragment-shader",
            "glsl" : [
                  "precision mediump float;",
                  "varying vec2 vTextureCoord;",
                  "uniform sampler2D uSampler0;",

                  "void main(void) {",
                        "gl_FragColor = texture2D(uSampler0, vec2(vTextureCoord.s, vTextureCoord.t));",
                        "gl_FragColor = vec4(1);",
                  "}"
            ]
      },

      "shader-vs-particles" : {
            "type" : "vertex-shader",
            "glsl" : [
                  "precision highp float;",
                  "attribute vec3 aVertexPosition;",
                  "attribute vec2 aTextureCoord;",
                  "attribute vec3 aNormal;",

                  "uniform mat4 uMVMatrix;",
                  "uniform mat4 uPMatrix;",
                  "uniform float pointSize;",

                  "varying vec2 vTextureCoord;",
                  // "varying vec3 vLightWeighting;",
                  "varying vec3 vNorm;",

                  "void main(void) {",
                        // "gl_PointSize = pointSize;",
                        "gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);",
                        // "vec3 norm = aNormal;",
                        "vNorm = aNormal;",

                        // "vec3 lightColor = vec3(1.0);",
                        // "vec3 ambientColor = vec3(.2);",
                        // "vec3 lightDir = vec3(0.0, 1.0, 1.0);",
                        // "lightDir = normalize(lightDir);",
                        // "float directionalLightWeighting0 = max(dot(norm, lightDir), 0.0);",
                        // "vLightWeighting = (lightColor * directionalLightWeighting0) * .8 + ambientColor;",

                        "vTextureCoord = aTextureCoord;",
                  "}"
            ]
      },


      "shader-fs-light" : {
            "type" : "fragment-shader",
            "glsl" : [
                  "precision mediump float;",
                  "varying vec2 vTextureCoord;",
                  "uniform sampler2D uSampler0;",
                  // "varying vec4 vFinalColor;",
                  // "varying vec3 vLightWeighting;",
                  "varying vec3 vNorm;",

                  "void main(void) {",
                        "vec4 color = texture2D(uSampler0, vec2(vTextureCoord.s, vTextureCoord.t));",
                        "vec3 lightColor = vec3(1.0);",
                        "vec3 ambientColor = vec3(.2);",
                        "vec3 lightDir = vec3(0.0, 1.0, 1.0);",
                        "lightDir = normalize(lightDir);",

                        
                        "vec3 center = vec3(.5);",
                        "vec3 norm = vNorm + (color.rgb - center);",
                        "norm = normalize(norm);",

                        "float directionalLightWeighting0 = max(dot(norm, lightDir), 0.0);",
                        "vec3 vLightWeighting = (lightColor * directionalLightWeighting0) * .8 + ambientColor;",
                        "color.rgb *= vLightWeighting;",
                        
                        "gl_FragColor = color;",
                  "}"
            ]
      },


      "shader-vs-facefront" : {
            "type" : "vertex-shader",
            "glsl" : [
                  "attribute vec3 aVertexPosition;",
                  "attribute vec2 aTextureCoord;",
                  "attribute vec2 sizeOffset;",
                  "attribute vec3 animCount;",

                  "uniform mat4 uMVMatrix;",
                  "uniform mat4 uPMatrix;",
                  "uniform mat3 invertCamera;",
                  "uniform float count;",

                  "varying vec2 vTextureCoord;",
                  "varying vec3 vVertexCoord;",
                  "varying float vDiffCount;",
                  // "varying float vRotation;",

                  "vec2 rotate(vec2 pos, float alpha) {",
                        "mat3 trans = mat3(  cos(alpha), -sin(alpha),  0.0,",
                                            "sin(alpha),  cos(alpha),  0.0,",
                                            "0.0,         0.0,         1.0 );",
                        "return vec2(trans * vec3(pos, 1.0));",
                  "}",

                  "void main(void) {",
                        "vec2 rotatedSize = rotate(sizeOffset, animCount.z);",
                        "vec3 size = vec3(rotatedSize, 0.0);",
                        "float diffCount = count - animCount.x + animCount.y;",
                        "if(diffCount < 0.0) diffCount = 0.0;",
                        "else if(diffCount > 15.0) diffCount = 15.0;",
                        "vDiffCount = diffCount;",

                        "vec3 adjustSize = size * invertCamera;",
                        // "adjustSize.xy = rotate(adjustSize.xy, animCount.z);",
                        "vec3 pos = aVertexPosition + adjustSize;",

                        "vec4 finalPos = uPMatrix * uMVMatrix * vec4(pos, 1.0);",
                        "gl_Position = finalPos;",
                        "vTextureCoord = aTextureCoord;",
                        "vVertexCoord = finalPos.xyz;",
                        // "vRotation = animCount.z;",
                  "}"
            ]
      },


      "shader-fs-anim" : {
            "type" : "fragment-shader",
            "glsl" : [
                  "precision mediump float;",
                  "varying vec2 vTextureCoord;",
                  "uniform sampler2D uSampler0;",
                  "varying float vDiffCount;",
                  "uniform float coordOffset;",
                  "varying float vRotation;",

                  "void main(void) {",
                        "vec2 pos = vTextureCoord;",
                        "float tx = mod(vDiffCount, 4.0) * coordOffset;",
                        "float ty = floor(vDiffCount/4.0) * coordOffset;",
                        "pos.x += tx;",
                        "pos.y += 1.0-ty;",
                        "gl_FragColor = texture2D(uSampler0, pos);",
                        "gl_FragColor.rgb = vec3(.5);",
                  "}"
            ]
      },


      "shader-fs-post" : {
            "type" : "fragment-shader",
            "glsl" : [
                  "precision mediump float;",
                  "varying vec2 vTextureCoord;",
                  "uniform sampler2D uSampler0;",
                  "uniform sampler2D uSampler1;",
                  "uniform sampler2D uSampler2;",
                  "uniform sampler2D uSampler3;",

                  "float overlay(float top, float bottom) {",
                        "if(bottom > .5) {",
                              "return 2.0 * top * bottom;",
                        "} else {",
                              "return 1.0-(2.0*(1.0-top)*(1.0-bottom));",
                        "}",
                  "}",


                  "vec2 contrastPos(vec2 uv, float offset) {",
                        "vec2 center = vec2(.5);",
                        "return center + (uv-center) * offset;",
                  "}",

                  "void main(void) {",
                        "vec2 pos = vTextureCoord;",
                        "vec4 color = texture2D(uSampler0, pos);",
                        "vec4 colorStrokes = texture2D(uSampler1, pos);",
                        "vec4 colorFloor = texture2D(uSampler2, pos);",
                        // "vec4 colorBlur = texture2D(uSampler3, pos);",
                        "vec4 colorBlur = texture2D(uSampler3, contrastPos(pos, 0.98));",
                        // "colorStrokes.rgb = vec3(0);",
                        // "color.rgb *= .5;",
                        
                        "vec2 center = vec2(.5);",
                        "float offset = length(pos-center) / .35;",
                        "colorStrokes = offset * colorBlur + (1.0 - offset) * colorStrokes;",
                        // "colorStrokes = colorBlur.a * colorStrokes + (1.0 - colorBlur.a) * colorBlur;",

                        "colorStrokes *= color;",
                        "colorStrokes.r = overlay(colorStrokes.r, colorFloor.r);",
                        "colorStrokes.g = overlay(colorStrokes.g, colorFloor.g);",
                        "colorStrokes.b = overlay(colorStrokes.b, colorFloor.b);",
                        "colorStrokes.a = overlay(colorStrokes.a, colorFloor.a);",
                        "gl_FragColor = colorStrokes;",
                        // "gl_FragColor = colorBlur;",
                  "}"
            ]
      },


      "shader-vs-vBlur" : {
            "type" : "vertex-shader",
            "glsl" : [
                  "precision highp float;",
                  "attribute vec3 aVertexPosition;",
                  "attribute vec2 aTextureCoord;",

                  "uniform mat4 uMVMatrix;",
                  "uniform mat4 uPMatrix;",

                  "varying vec2 vTextureCoord;",
                  "varying vec2 vBlurTexCoords[14];",

                  "void main(void) {",
                        "gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);",
                        "vTextureCoord = aTextureCoord;",
                        "vBlurTexCoords[ 0] = vTextureCoord + vec2(0.0, -0.028);",
                        "vBlurTexCoords[ 1] = vTextureCoord + vec2(0.0, -0.024);",
                        "vBlurTexCoords[ 2] = vTextureCoord + vec2(0.0, -0.020);",
                        "vBlurTexCoords[ 3] = vTextureCoord + vec2(0.0, -0.016);",
                        "vBlurTexCoords[ 4] = vTextureCoord + vec2(0.0, -0.012);",
                        "vBlurTexCoords[ 5] = vTextureCoord + vec2(0.0, -0.008);",
                        "vBlurTexCoords[ 6] = vTextureCoord + vec2(0.0, -0.004);",
                        "vBlurTexCoords[ 7] = vTextureCoord + vec2(0.0,  0.004);",
                        "vBlurTexCoords[ 8] = vTextureCoord + vec2(0.0,  0.008);",
                        "vBlurTexCoords[ 9] = vTextureCoord + vec2(0.0,  0.012);",
                        "vBlurTexCoords[10] = vTextureCoord + vec2(0.0,  0.016);",
                        "vBlurTexCoords[11] = vTextureCoord + vec2(0.0,  0.020);",
                        "vBlurTexCoords[12] = vTextureCoord + vec2(0.0,  0.024);",
                        "vBlurTexCoords[13] = vTextureCoord + vec2(0.0,  0.028);",
                  "}"
            ]
      },


      "shader-vs-hBlur" : {
            "type" : "vertex-shader",
            "glsl" : [
                  "precision highp float;",
                  "attribute vec3 aVertexPosition;",
                  "attribute vec2 aTextureCoord;",

                  "uniform mat4 uMVMatrix;",
                  "uniform mat4 uPMatrix;",

                  "varying vec2 vTextureCoord;",
                  "varying vec2 vBlurTexCoords[14];",

                  "void main(void) {",
                        "gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);",
                        "vTextureCoord = aTextureCoord;",
                        "vBlurTexCoords[ 0] = vTextureCoord + vec2(-0.028, 0.0);",
                        "vBlurTexCoords[ 1] = vTextureCoord + vec2(-0.024, 0.0);",
                        "vBlurTexCoords[ 2] = vTextureCoord + vec2(-0.020, 0.0);",
                        "vBlurTexCoords[ 3] = vTextureCoord + vec2(-0.016, 0.0);",
                        "vBlurTexCoords[ 4] = vTextureCoord + vec2(-0.012, 0.0);",
                        "vBlurTexCoords[ 5] = vTextureCoord + vec2(-0.008, 0.0);",
                        "vBlurTexCoords[ 6] = vTextureCoord + vec2(-0.004, 0.0);",
                        "vBlurTexCoords[ 7] = vTextureCoord + vec2( 0.004, 0.0);",
                        "vBlurTexCoords[ 8] = vTextureCoord + vec2( 0.008, 0.0);",
                        "vBlurTexCoords[ 9] = vTextureCoord + vec2( 0.012, 0.0);",
                        "vBlurTexCoords[10] = vTextureCoord + vec2( 0.016, 0.0);",
                        "vBlurTexCoords[11] = vTextureCoord + vec2( 0.020, 0.0);",
                        "vBlurTexCoords[12] = vTextureCoord + vec2( 0.024, 0.0);",
                        "vBlurTexCoords[13] = vTextureCoord + vec2( 0.028, 0.0);",
                  "}"
            ]
      },


      "shader-fs-blur" : {
            "type" : "fragment-shader",
            "glsl" : [
                  "precision mediump float;",
                  "varying vec2 vTextureCoord;",
                  "uniform sampler2D uSampler0;",
                  "varying vec2 vBlurTexCoords[14];",

                  "void main(void) {",
                        "gl_FragColor = vec4(0.0);",
                        "gl_FragColor += texture2D(uSampler0, vBlurTexCoords[ 0])*0.0044299121055113265;",
                        "gl_FragColor += texture2D(uSampler0, vBlurTexCoords[ 1])*0.00895781211794;",
                        "gl_FragColor += texture2D(uSampler0, vBlurTexCoords[ 2])*0.0215963866053;",
                        "gl_FragColor += texture2D(uSampler0, vBlurTexCoords[ 3])*0.0443683338718;",
                        "gl_FragColor += texture2D(uSampler0, vBlurTexCoords[ 4])*0.0776744219933;",
                        "gl_FragColor += texture2D(uSampler0, vBlurTexCoords[ 5])*0.115876621105;",
                        "gl_FragColor += texture2D(uSampler0, vBlurTexCoords[ 6])*0.147308056121;",
                        "gl_FragColor += texture2D(uSampler0, vTextureCoord)*0.159576912161;",
                        "gl_FragColor += texture2D(uSampler0, vBlurTexCoords[ 7])*0.147308056121;",
                        "gl_FragColor += texture2D(uSampler0, vBlurTexCoords[ 8])*0.115876621105;",
                        "gl_FragColor += texture2D(uSampler0, vBlurTexCoords[ 9])*0.0776744219933;",
                        "gl_FragColor += texture2D(uSampler0, vBlurTexCoords[10])*0.0443683338718;",
                        "gl_FragColor += texture2D(uSampler0, vBlurTexCoords[11])*0.0215963866053;",
                        "gl_FragColor += texture2D(uSampler0, vBlurTexCoords[12])*0.00895781211794;",
                        "gl_FragColor += texture2D(uSampler0, vBlurTexCoords[13])*0.0044299121055113265;",
                  "}"
            ]
      }
};


