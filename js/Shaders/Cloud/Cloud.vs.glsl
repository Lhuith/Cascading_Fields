		precision highp float;

		attribute vec3 position;
		attribute vec3 offset;
		attribute vec3 col;
		attribute vec2 uv;
		attribute vec2 uvoffset;
		attribute vec3 scaleInstance;
		attribute float typeSwitch;
		attribute vec2 animationFrame;
		attribute vec4 orientation;
		attribute vec3 normal;
		
		varying vec2 vUv;	
		varying vec2 framePass;
		varying vec3 colorPass;
		varying vec2 uvoffsetPass;
		varying vec2 spritesheetsizePass;
		varying vec3 viewDirection;
		varying vec4 posWorld;
		varying vec3 vecNormal;

		uniform mat4 modelMatrix;
		uniform vec3 cameraPosition;
		uniform mat3 normalMatrix;
		uniform float time;
		uniform float animationSwitch;
		uniform float spriteSheetX;
		uniform float spriteSheetY;
		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		
		// http://www.geeks3d.com/20141201/how-to-rotate-a-vertex-by-a-quaternion-in-glsl/
		vec3 applyQuaternionToVector( vec4 q, vec3 v ){
			return v + 2.0 * cross( q.xyz, cross( q.xyz, v ) + q.w * v );
		}

		void main() {

			vec4 finalPosition = vec4(0);
			
			vecNormal = (normalMatrix  * vec3(normal)).xyz;

			if(typeSwitch == 0.0){
				//Normal Sprite State ---------------------------------------------------
				vec4 mvPosition = modelViewMatrix * vec4( offset * 1.0, 1.0 );
				mvPosition.xyz += (position * scaleInstance);
				finalPosition = projectionMatrix * mvPosition;
				//Normal Sprite State ---------------------------------------------------
			} else if (typeSwitch == 1.0){
				//Solid Sprite State ---------------------------------------------------
				vec3 ScaledPos = position * scaleInstance;
				vec3 vPosition = applyQuaternionToVector( orientation, ScaledPos );
				finalPosition = projectionMatrix * modelViewMatrix * vec4( offset + vPosition, 1.0 );
				//Solid Sprite State ---------------------------------------------------
			}


			vUv = vec2((uv.x/spriteSheetX) + (uvoffset.x), (uv.y/spriteSheetY) + (uvoffset.y));
			
			//viewdirection
			posWorld = modelMatrix * vec4((offset),1.0);
			viewDirection = normalize((posWorld.xyz - cameraPosition.xyz));	
			//---------------------------------------------------------

			colorPass = col.rgb;
			framePass = animationFrame;
			uvoffsetPass = uvoffset;
			spritesheetsizePass = vec2(spriteSheetX, spriteSheetY);	
	
			gl_Position = finalPosition;
		}