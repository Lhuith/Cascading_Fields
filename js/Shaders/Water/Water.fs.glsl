		 
uniform sampler2D texture;	
uniform sampler2D extra;		 	
varying vec2 vUv;
uniform float time;
varying vec3 vecNormal;
uniform int noTexture;
uniform vec4 customColor;
uniform int customColorSwitch;

uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

		//Refer the Text Parse in Main.js, replaced this Sexy Text with Dither Methods,
		//I just didnt want it cluttering shizz up
		//Basicaling just pointers to the shadow and dither methods
		AddShadow
		AddDither
	
		#if NUM_DIR_LIGHTS > 0
		struct DirectionalLight 
		{
			vec3 direction;
			vec3 color;
			int shadow;
			float shadowBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};

		uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHTS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];

		#endif

		float random (vec2 st) {
   			 return fract(sin(dot(st.xy,vec2(12.9898,78.233)))* 43758.5453123);
		}

		void main()
		{
			vec3 sumDirLights = ((dot(normalize(directionalLights[0].direction), 
			vecNormal)) * directionalLights[0].color) * 1.10;

			float shadowValue = getShadow(directionalShadowMap[ 0 ], directionalLights[0].shadowMapSize, 
			directionalLights[0].shadowBias, directionalLights[0].shadowRadius, vDirectionalShadowCoord[0] );

			vec3 shadowVal = vec3(shadowValue,shadowValue,shadowValue);
			vec4 shadowDither = vec4(dither(shadowVal), 1.0);
			vec4 light = vec4(dither(sumDirLights), 1.0);
			vec4 color;
			//dither
			if(customColorSwitch == 1)
			{
				color = customColor;
			}
			else
			{
				color = vec4(1.0, 1.0, 1.0, 1.0);
			}
	

			vec4 extSample = texture2D(extra, vec2(vUv.x, 1.0 - vUv.y));
			
			float alpha = extSample.a;
			vec4 mask = vec4(alpha, alpha, alpha, alpha);

			float Invertalpha = 1.0 - extSample.a;
			
			vec4 maskInvert = vec4(Invertalpha, Invertalpha, Invertalpha, Invertalpha);
			
			vec4 ext = texture2D(extra, vec2(vUv.x, 1.0 - vUv.y)) - maskInvert;

			
			//wierd fade in effect =o
			//vec2 anim_uv = vec2(mod((vUv.x) * 25.0, 0.5) * mod(time, 0.5), vUv.y*25.0);
			vec2 st = vUv.xy;
			float rnd = ceil(random( st ));
			float offset = ceil(mod(time * 2.0, 4.0)-1.0)/4.0;

			vec2 anim_uv = vec2(mod((vUv.x) * 50.0, 0.25) + offset, vUv.y*100.0);
			vec4 tex = texture2D(texture, anim_uv);

			vec4 final = max(ext, tex);
			float time_test = sin(time);
			gl_FragColor = vec4(tex.rgb * light.rgb, 0.75);

		#ifdef USE_FOG
          #ifdef USE_LOGDEPTHBUF_EXT
              float depth = gl_FragDepthEXT / gl_FragCoord.w;
          #else
              float depth = gl_FragCoord.z / gl_FragCoord.w;
          #endif
          float fogFactor = smoothstep( fogNear, fogFar, depth );
          gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
      #endif
		}