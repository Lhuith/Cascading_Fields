//Credit to https://www.shadertoy.com/view/4lSSRw : Star Noise
//Credit to https://www.shadertoy.com/view/ldBczz : Random Colors
uniform vec2 resolution;
uniform vec3 randomColsMults;
uniform float time;
uniform float alpha;
varying vec2 vUv;

uniform vec4 skyCol;

uniform sampler2D _MainTex;	

void main() 
{
  vec2 uv = vUv * 1000.0;//nc(vUv.x, vUv.y );

	vec4 tex = texture2D(_MainTex, vUv);

  tex.a = 1.0;
  //
	gl_FragColor = (tex * alpha) + vec4(skyCol.rgb, 1.0);//+  vec4(sparkles,sparkles,sparkles, 1.);

}

