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
		varying vec3 uvoffsetPass;
		varying vec2 spritesheetsizePass;

		void main() {


			float uvTime = 1.0;

			if(animationSwith == 1.0){
				uvTime = time;
			}

			float timeOffsetX = mod(time, framePass.x)/spritesheetsizePass.x;
			vec2 uvIndex = vec2(vUv.x + timeOffsetX, vUv.y);

			vec4 tex = texture2D( map, uvIndex);

			if (tex.a != 1.0) 
			discard;

			gl_FragColor = tex * vec4(colorPass, 1.0) * vec4(fogColor,1.0);

			float depth = (gl_FragCoord.z / gl_FragCoord.w)/2.0;

          float fogFactor = smoothstep( fogNear, fogFar, depth );
          gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );

		}