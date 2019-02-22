varying vec3 vWorldPosition;
varying vec2 vUv;
varying vec3 normalDirection;
varying vec3 viewDirection;

void main()
{
    vUv = uv;

    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;

    //posWorld = (modelMatrix * (vec4(position, 1.0))); 			
    normalDirection = normalize((vec4(normal, 0.0) * modelMatrix).xyz);	
    viewDirection = normalize(cameraPosition.xyz -	worldPosition.xyz);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}