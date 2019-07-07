		varying vec2 vUv;

 		uniform vec3 lightpos;
		
		varying vec3 vecNormal;
		uniform float time;
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHTS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];

		void main() 
		{	
			vUv = vec2(uv.x, uv.y);
			
			vec3 transformed = vec3( position );
			vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

			vecNormal = (modelViewMatrix * vec4(normal, 0.0)).xyz;

			vec4 eyepos = modelViewMatrix * vec4 (position, 1.0);
			vec4 lighteye = viewMatrix * vec4 (lightpos, 1.0);

			
			vec4 tmp = modelViewMatrix * vec4 (lightpos, 1.0);

			vec4 worldPosition = modelMatrix * vec4( transformed, 1.0 );

			 // store the world position as varying for lighting
			
			gl_Position = projectionMatrix * mvPosition;

			for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

				vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * worldPosition;
			}
		}