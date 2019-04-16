		precision highp float;
		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;
		attribute vec3 position;
		attribute vec3 offset;
		attribute vec3 col;
		attribute vec2 uv;
		attribute vec2 uvoffset;
		attribute vec3 scaleInstance;
		
		attribute vec4 orientation;
		attribute vec2 animationFrame;

		varying vec2 vUv;
		uniform float spriteSheetX;
		uniform float spriteSheetY;

		uniform float time;
		uniform float animationSwith;
		
		varying vec3 colorPass;
		varying float distToCamera;


		varying vec2 framePass;
		varying vec2 uvoffsetPass;
		varying vec2 spritesheetsizePass;

		// http://www.geeks3d.com/20141201/how-to-rotate-a-vertex-by-a-quaternion-in-glsl/
		vec3 applyQuaternionToVector( vec4 q, vec3 v ){
			return v + 2.0 * cross( q.xyz, cross( q.xyz, v ) + q.w * v );
		}

		void main() {

			vec3 ScaledPos = position * scaleInstance;
			vec3 vPosition = applyQuaternionToVector( orientation, ScaledPos );
			gl_Position = projectionMatrix * modelViewMatrix * vec4( offset + vPosition, 1.0 );
			
			float uvTime = 1.0;

			if(animationSwith == 1.0){
				uvTime = time;
			}
			float timeOffsetX = mod(time, animationFrame.x + 1.0);
			//vec2((uv.x/spriteSheetX) * (uvoffset.x * 1.0), (uv.y/spriteSheetY) + (uvoffset.y));
			vUv = vec2((uv.x/spriteSheetX) + (uvoffset.x), (uv.y/spriteSheetY) + (uvoffset.y));


			

			colorPass = col.rgb;
		}