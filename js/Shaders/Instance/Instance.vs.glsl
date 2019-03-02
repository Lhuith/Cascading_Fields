	precision highp float;
		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;
		attribute vec3 position;
		attribute vec3 offset;
		attribute vec2 uv;
		attribute vec4 orientation;
		varying vec2 vUv;
		// http://www.geeks3d.com/20141201/how-to-rotate-a-vertex-by-a-quaternion-in-glsl/
		vec3 applyQuaternionToVector( vec4 q, vec3 v ){
			return v + 2.0 * cross( q.xyz, cross( q.xyz, v ) + q.w * v );
		}
		void main() {
			vec3 vPosition = applyQuaternionToVector( orientation, position );
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( offset + vPosition, 1.0 );
		}