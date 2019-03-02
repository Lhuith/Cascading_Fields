<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, height=device-height">
	<meta name="description" content="Eugene Martens Portfolio">
	<meta name="keywords" content="Eugene Martens, Portfolio, software development, web desighn, game development, programming">
	<meta name="author" content="Eugene Martens">
	<link rel="shortcut icon" type="image/png" href="img/Icons/favicon.ico">

	<title>Gene Space | Oh Hey</title>
	<link rel="stylesheet" href="./css/style.css">
	<script>
		(function (i, s, o, g, r, a, m) {
			i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
				(i[r].q = i[r].q || []).push(arguments)
			}, i[r].l = 1 * new Date(); a = s.createElement(o),
				m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
		})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

		ga('create', 'UA-104121571-1', 'auto');
		ga('send', 'pageview');
	</script>


	<!-- Three JS -->
	<script type="text/javascript" src="js/THREE/three.min.js"></script>
	<!-- JQuery <.< -->
	<script type="text/javascript" src="js/JQ.js"></script>

	<script type="text/javascript" src="js/THREE/CanvasRenderer.js"></script>
	<script type="text/javascript" src="js/THREE/OrbitControls.js"></script>
	<script type="text/javascript" src="js/THREE/LookControls.js"></script>
	<script type="text/javascript" src="js/THREE/WorldData.js"></script>
	<script type="text/javascript" src="js/THREE/Gyroscope.js"></script>
	
	

	<!--Post Processing Stuff -->
	<script type="text/javascript" src="js/THREE/EffectComposer.js"></script>
	<script type="text/javascript" src="js/THREE/RenderPass.js"></script>
	<script type="text/javascript" src="js/THREE/CopyShader.js"></script>
	<script type="text/javascript" src="js/THREE/ShaderPass.js"></script>
	<script type="text/javascript" src="js/THREE/stats.min.js"></script>
	<script type="text/javascript" src="js/THREE/RemoveInvis.js"></script>
	<script type="text/javascript" src="js/Shaders/Planet/DitherParameters.js"></script>
	<script type="text/javascript" src="js/Helpers/ColorPalletes.js"></script>

	<!--Helpers -->
	<script type="text/javascript" src="js/Helpers/perlin.js"></script>
	<script type="text/javascript" src="js/Helpers/Vector2.js"></script>
	<script type="text/javascript" src="js/Helpers/MathUtils.js"></script>
	<script type="text/javascript" src="js/Helpers/OrbitUtils.js"></script>
	<script type="text/javascript" src="js/Helpers/PlanetInfo.js"></script>
	<script type="text/javascript" src="js/Loaders.js"></script>
	<script type="text/javascript" src="js/LaberGenerator.js"></script>
	<script type="text/javascript" src="js/GibbirishGenerator.js"></script>

	<!-- World Generator -->
	<script type="text/javascript" src="js/WorldGenerator/FallOffGenerator.js"></script>
	<script type="text/javascript" src="js/WorldGenerator/MapGenerator.js"></script>
	<script type="text/javascript" src="js/WorldGenerator/MeshGenerator.js"></script>
	<script type="text/javascript" src="js/WorldGenerator/Noise1D.js"></script>
	<script type="text/javascript" src="js/WorldGenerator/Noise2D.js"></script>
	<script type="text/javascript" src="js/WorldGenerator/NoiseFromTexture.js"></script>
	<script type="text/javascript" src="js/WorldGenerator/Regions.js"></script>
	<script type="text/javascript" src="js/WorldGenerator/EnviromentalObjectGenerator.js"></script>

</head>

<body>
<script id="vertexShader" type="x-shader/x-vertex">
		precision highp float;
		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;
		attribute vec3 position;
		attribute vec3 offset;
		attribute vec3 col;
		attribute vec2 uv;
		attribute vec4 orientation;
		varying vec2 vUv;
	
		varying vec3 colorPass;
		// http://www.geeks3d.com/20141201/how-to-rotate-a-vertex-by-a-quaternion-in-glsl/
		vec3 applyQuaternionToVector( vec4 q, vec3 v ){
			return v + 2.0 * cross( q.xyz, cross( q.xyz, v ) + q.w * v );
		}
		void main() {
			
			vec4 mvPosition = modelViewMatrix * vec4( offset, 1.0 );
			mvPosition.xyz += position;
			vUv = uv;
			gl_Position = projectionMatrix * mvPosition;
			colorPass = col.rgb;
		}
	</script>

	<script id="fragmentShader" type="x-shader/x-fragment">


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

			#ifdef USE_FOG
          #ifdef USE_LOGDEPTHBUF_EXT
              float depth = gl_FragDepthEXT / gl_FragCoord.w;
          #else
              float depth = gl_FragCoord.z / gl_FragCoord.w;
          #endif
          float fogFactor = smoothstep( fogNear, fogFar, depth );
          gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
      #endif

		}
	</script>
	
<!-- <script id="vertexShader" type="x-shader/x-vertex">
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
	</script>

	<script id="fragmentShader" type="x-shader/x-fragment">
		precision highp float;
		uniform sampler2D map;
		varying vec2 vUv;
		void main() {
			gl_FragColor = texture2D( map, vUv );
		}
	</script>
-->
	<div id="webGL-container-map_view"></div>
	<div id="webGL-container"></div>
	<div id="blocker">

		<div id="instructions">
			<span style="font-size:40px">Click to play</span>
			<br />
			(W, A, S, D = Move, SPACE = Jump, MOUSE = Look around)
		</div>

	</div>
	<script type="text/javascript" src="js/main.js"></script>

	<footer class="page-footer gold footer-body padding-10 ">
		<h6 class="t-align-c">Created using THREE.js</h6>
	</footer>
</body>

</html>