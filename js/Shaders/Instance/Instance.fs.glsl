		precision highp float;
		uniform sampler2D map;
		varying vec2 vUv;
		varying vec3 colorPass;

		uniform vec3 fogColor;
		uniform float fogNear;
		uniform float fogFar;


		void main() {
			vec4 tex = texture2D( map, vUv );

			if (tex.a != 1.0) 
			discard;

			gl_FragColor = tex * vec4(colorPass, 1.0);

             float depth = gl_FragCoord.z / gl_FragCoord.w;

          float fogFactor = smoothstep( fogNear, fogFar, depth );
          gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );


		}