		precision highp float;
		uniform sampler2D map;
		varying vec2 vUv;
		varying vec3 colorPass;

		uniform vec3 fogColor;
		uniform float fogNear;
		uniform float fogFar;

		uniform float time;
		uniform float animationSwith;

		varying vec2 framePass;
		varying vec2 uvoffsetPass;
		varying vec2 spritesheetsizePass;

		varying vec3 viewDirection;
		varying vec4 posWorld;

		const float PI = 3.1415926535897932384626433832795;

		float AbsoluteAngle(float angle) {
    		return (mod(angle, 360.0)) >= 0.0 ? angle : (angle + 360.0);
		}

		void main() {
			float uvTime = 1.0;
			vec2 uvIndex = vec2(1.0);

			if(animationSwith == 1.0){
				
				vec2 diff = vec2(posWorld.x - viewDirection.x, posWorld.y - viewDirection.y);
				//Regions mapped from -1 to 1;
				float angle = atan(diff.y, diff.x);
				float offset = PI / 4.0;

				float dagrees = AbsoluteAngle((angle + offset) * 180.0 / PI);

				//normaledAngle = (normaledAngle * 2) - 1;
				float normalizedAngle = dagrees / 360.0;

				float index = ceil(mod(normalizedAngle * 4.0, 4.0)) - 1.0;

				uvTime = time;
				float timeOffsetX = ceil(mod(time*15.0, (framePass.x))-1.0)/spritesheetsizePass.x;
				uvIndex = vec2(vUv.x + (timeOffsetX - uvoffsetPass.x), vUv.y + index);

				
			} else {
				uvIndex = vec2(vUv.x, vUv.y);
			}


			vec4 tex = texture2D( map, uvIndex);

			if (tex.a != 1.0) 
			discard;

			gl_FragColor = tex * vec4(colorPass, 1.0) * vec4(fogColor,1.0);

			float depth = (gl_FragCoord.z / gl_FragCoord.w)/2.0;

          float fogFactor = smoothstep( fogNear, fogFar, depth );
          gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );

		}
