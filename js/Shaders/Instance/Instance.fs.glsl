		precision highp float;
		uniform sampler2D map;
		varying vec2 vUv;
		varying vec3 colorPass;

		uniform vec3 fogColor;
		uniform float fogNear;
		uniform float fogFar;
		varying float distToCamera;

		uniform float time;
		uniform float animationSwith;

		varying vec2 framePass;
		varying vec2 uvoffsetPass;
		varying vec2 spritesheetsizePass;

		addShadow
		addDither
		
		void main() {

			float uvTime = 1.0;
			vec2 uvIndex = vec2(1.0);

			if(animationSwith == 1.0){
				uvTime = time;
				float timeOffsetX = ceil(mod(time*2.0, (framePass.x))-1.0)/spritesheetsizePass.x;
				uvIndex = vec2(vUv.x + (timeOffsetX - uvoffsetPass.x), vUv.y);
			} else {
				uvIndex = vec2(vUv.x, vUv.y);
			}

			vec4 tex = texture2D( map, uvIndex );

			if (tex.a != 1.0) 
			discard;
        float depth = gl_FragCoord.z / gl_FragCoord.w;
			gl_FragColor = tex * vec4(colorPass,1.0- depth ) * vec4(fogColor,1.0);;

     
		
          float fogFactor = smoothstep( fogNear, fogFar, depth );
          gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );


		}