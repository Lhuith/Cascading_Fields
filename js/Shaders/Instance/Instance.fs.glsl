		precision highp float;
		uniform sampler2D map;
		varying vec2 vUv;
		varying vec3 colorPass;

		uniform vec3 fogColor;
		uniform float fogNear;
		uniform float fogFar;
		varying float distToCamera;

		void main() {
			vec4 tex = texture2D( map, vUv );

			if (tex.a != 1.0) 
			discard;
        float depth = gl_FragCoord.z / gl_FragCoord.w;
			gl_FragColor = tex * vec4(colorPass,1.0- depth ) * vec4(fogColor,1.0);;

     
		
          float fogFactor = smoothstep( fogNear, fogFar, depth );
          gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );


		}