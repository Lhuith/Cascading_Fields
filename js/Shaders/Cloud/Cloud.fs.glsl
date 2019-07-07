		precision highp float;
		uniform sampler2D map;
		varying vec2 vUv;
		varying vec3 colorPass;

		uniform vec3 fogColor;
		uniform float fogNear;
		uniform float fogFar;

		uniform float time;
		uniform float animationSwitch;
		uniform float is3D;

		varying vec2 framePass;
		varying vec2 uvoffsetPass;
		varying vec2 spritesheetsizePass;

		uniform vec3 cameraPosition;
		varying vec3 viewDirection;
		varying vec4 posWorld;
		varying vec3 vecNormal;
		
		const float PI = 3.1415926535897932384626433832795;

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

		float AbsoluteAngle(float angle) {
    		return (mod(angle, 360.0)) >= 0.0 ? angle : (angle + 360.0);
		}

		void main() {
			float uvTime = 1.0;
			vec2 uvIndex = vec2(1.0);

			if(animationSwitch == 1.0){
			
				float angle = atan(viewDirection.y, viewDirection.x) * (180.0 / PI);
				float offset = (PI / 4.0) * (180.0 / PI);

				float dagrees = AbsoluteAngle(angle + offset);

				//normaledAngle = (normaledAngle * 2) - 1;
				float normalizedAngle = dagrees / 360.0;

				float index = ceil(mod(normalizedAngle * 4.0, 4.0) - 1.0);

				uvTime = time;
				float timeOffsetX = ceil(mod(time*2.0, (framePass.x))-1.0)/spritesheetsizePass.x;
				
				float yUvOffset = vUv.y;

				if(is3D == 1.0){
				//
					yUvOffset += (index - uvoffsetPass.y)/spritesheetsizePass.y;
				}


				uvIndex = vec2(vUv.x + (timeOffsetX - uvoffsetPass.x), yUvOffset);

				
			} else {
				uvIndex = vec2(vUv.x, vUv.y);
			}
			vec4 tex = texture2D( map, uvIndex);

			if (tex.a != 1.0) 
			discard;
			

			float depth = (gl_FragCoord.z / gl_FragCoord.w);
		
			float depthFade = depth/1000.0;
			depthFade = clamp(depthFade, 0.5, 1.0);

			float depthTrans = 2.0 * (depth/2.0) - 1.0;

			vec3 lightFactor = vec3(0.0,0.0,1.0);
			vec3 L = normalize(-directionalLights[0].direction);
			vec3 l_dir = normalize(directionalLights[0].direction);
			float nDotL = max(0.0, dot(vecNormal.xyz, l_dir));
			lightFactor =  directionalLights[0].color * nDotL; 

			vec3 V = viewDirection;
			vec3 N = vecNormal;
			vec3 H = normalize(L + N * 0.5);

			float I = pow(clamp(dot(V, -H), 0.0, 1.0), 0.9) * 0.9;

			float depth_factor = smoothstep(fogFar, fogNear, depth * 3.0);

			gl_FragColor = tex * vec4((colorPass * depth_factor), 1.0);

			float fogFactor = smoothstep( fogNear, fogFar, depth * 5.0);
			gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, (fogFactor));
		}
