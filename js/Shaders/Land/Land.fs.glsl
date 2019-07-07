		 
uniform sampler2D texture;	
uniform sampler2D extra;		 	
varying vec2 vUv;

varying vec3 vecNormal;
uniform int noTexture;
uniform vec4 customColor;
uniform int customColorSwitch;

uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;
varying vec4 worldPosition;
varying vec3 viewDirection;
uniform vec3 SunLightPosition;

		//Refer the Text Parse in Main.js, replaced this Sexy Text with Dither Methods,
		//I just didnt want it cluttering shizz up
		//Basicaling just pointers to the shadow and dither methods
		AddShadow
		AddDither
	
		#if NUM_DIR_LIGHTS > 0
			struct DirectionalLight 
			{
				vec3 color;
				vec3 direction;
				int shadow;
				float shadowBias;
				float shadowRadius;
				vec2 shadowMapSize;
			};

			uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHTS ];
			varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];
		
		#endif
		void main()
		{

		
			//vec3 sumDirLights = (clamp(dot(normalize(directionalLights[0].direction), 
			//vecNormal), 0.0, 0.65) * directionalLights[0].color) * 1.1;
			//
//
			//float shadowValue = getShadow(directionalShadowMap[ 0 ], directionalLights[0].shadowMapSize, 
			//directionalLights[0].shadowBias, directionalLights[0].shadowRadius, vDirectionalShadowCoord[0] );
//
			//vec3 shadowVal = vec3(shadowValue,shadowValue,shadowValue);
			//vec4 shadowDither = vec4(dither(shadowVal), 1.0);
			//vec4 light = vec4(dither(sumDirLights), 1.0);
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
			
			vec4 ext = texture2D(extra, vUv);

			vec4 tex = texture2D(texture, vUv);
			
			vec3 lightFactor = vec3(0.0,0.0,1.0);

			vec4 final = max(ext, tex);
			vec3 ecToLight = normalize(directionalLights[0].direction);
			
			float nDotL = max(0.0, dot(vecNormal.xyz, ecToLight));

			lightFactor =  directionalLights[0].color * nDotL; 

			gl_FragColor = tex * vec4(lightFactor, 0.65);// * light;


			#ifdef USE_FOG
				#ifdef USE_LOGDEPTHBUF_EXT
					float depth = gl_FragDepthEXT / gl_FragCoord.w;
				#else
					float depth = gl_FragCoord.z / gl_FragCoord.w;
				#endif
				float fogFactor = smoothstep( fogNear, fogFar, depth * 3.0);
				gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
			#endif
		}