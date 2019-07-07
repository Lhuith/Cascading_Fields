
var container, mapcontainer, stats, controls;
var camera, mapCamera, MainScene, BackgroundScene, renderer, MapRenderer, clock, composer;
var dirLight;

var worldObjects, objects = [];

var rotation = 0;
var mouse = { x: 0, y: 0 };

//var characterList = [];
var EnviromentalSpriteSheet;

var timer = 0;
var timeLimit = .25;
var startTime = Date.now();
var done;


AntLionInit();
init();
animate();



function CreateRenderer() {
    var webglrenderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });

    webglrenderer.setSize(Math.round(window.innerWidth / resolution), Math.round(window.innerHeight / resolution));

    webglrenderer.setClearColor(0x000000, 0);
    document.body.appendChild(webglrenderer.domElement);
    webglrenderer.autoClear = false;
    webglrenderer.domElement.style.width = Math.round(webglrenderer.domElement.width * resolution) + 'px';
    webglrenderer.domElement.style.height = Math.round(webglrenderer.domElement.height * resolution) + 'px';
    webglrenderer.setPixelRatio(window.devicePixelRatio);
    webglrenderer.shadowMap.enabled = true;
    webglrenderer.shadowMapSoft = false;
    webglrenderer.shadowMapSize = 32;
    webglrenderer.shadowMap.renderReverseSided = false;
    webglrenderer.shadowMap.renderSingleSided = false;

    return webglrenderer;
}

function add_to_MainScene(object) {
    //console.log(object);
    MainScene.add(object);
}

function EffectsInit(frontscene, backscene, renderer) {
    composer = new THREE.EffectComposer(renderer);

    var StarsRenderPass = new THREE.RenderPass(backscene, camera);
    composer.addPass(StarsRenderPass);

    var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
    composer.addPass(effectCopy);
    effectCopy.renderToScreen = true;

    var MainRenderPass = new THREE.RenderPass(frontscene, camera);
    MainRenderPass.clear = false;
    MainRenderPass.clearDepth = true;
    composer.addPass(MainRenderPass);

    MainRenderPass.renderToScreen = true;

    if (devicePixelRatio == 1)
        composer.setSize(window.innerWidth / resolution, window.innerHeight / resolution);
    else
        composer.setSize(window.innerWidth, window.innerHeight);


}

function init() {
    clock = new THREE.Clock();
    resolution = (window.devicePixelRatio == 1) ? 3 : 4;;

    BackgroundScene = new THREE.Scene();
    BackgroundScene.add(skyObject);

    var sizex = window.innerWidth * 26;
    var sizey = window.innerHeight * 25;
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100000);

    mapCamera = new THREE.OrthographicCamera(sizex / - 2, sizex / 2, sizey / 2, sizey / - 2, 1, 5000);
    //camera.add(mapCamera);
    mapCamera.position.set(0, 0, 0);
    mapCamera.rotation.x = -90 * (Math.PI / 180);
    mapCamera.position.y = 1000;

    MainScene = new THREE.Scene();
    //MainScene.background = new THREE.Color(0x42c5ff);
    MainScene.fog = new THREE.Fog(0x42c5ff, 0.0025, 10000);

    worldObjects = new THREE.Object3D();
    Clouds = new THREE.Object3D();

    collisionCheck = new Array();

    MainScene.add(worldObjects);
    MainScene.add(Clouds);
    MainScene.add(SunMoonObject);
    SunMoonObject.rotation.x = 25;


    //directionalLight.target = test_object;

    //mapCamera.lookAt(controls.getObject());
    //var shadowCam = new THREE.CameraHelper(dirLight.shadow.camera);
    //MainScene.add(shadowCam);
    Clouds.position.x = 1000;

    var gridHelper = new THREE.GridHelper(1000, 16);
    //MainScene.add(gridHelper);

    //MainScene.add(helper);

    //camera.position.y = -40;
    container = document.getElementById('webGL-container');
    document.body.appendChild(container);

    renderer = CreateRenderer();
    EffectsInit(MainScene, BackgroundScene, renderer);

    //Load Shaders and Setup SkyBox


    window.addEventListener("resize", onWindowResize, false);

    stats = new Stats()

    stats.domElement.style.position = 'absolute'
    stats.domElement.style.left = '0px'
    stats.domElement.style.bottom = '0px'
    container.appendChild(stats.domElement);

    cascading_fields_init(camera, MainScene);
}

//function FogController() {
//    var fogFarValue = controls.getObject().position.y;
//}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // renderer.setSize( window.innerWidth, window.innerHeight );

    //composer.setSize(Math.round(window.innerWidth / resolution), Math.round(window.innerHeight / resolution));
    renderer.setSize(Math.round(window.innerWidth / resolution), Math.round(window.innerHeight / resolution));
    renderer.domElement.style.width = Math.round((renderer.domElement.width) * resolution) + 'px';
    renderer.domElement.style.height = Math.round((renderer.domElement.height) * resolution) + 'px';

}

function animate() {


    stats.begin();
    var delta = clock.getDelta();
    timer += delta;


    cascading_fields_update(delta, camera);
    stats.end();

    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(MainScene, camera);
    composer.render();
    //MapRenderer.render(MainScene, mapCamera);

}

function toScreenPosition(obj, camera) {
    var vector = new THREE.Vector3();

    var widthHalf = window.innerWidth / 2;
    var heightHalf = window.innerHeight / 2;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = (vector.x * widthHalf) + widthHalf;
    vector.y = - (vector.y * heightHalf) + heightHalf;
    vector.z = obj.position.z;
    return {
        x: vector.x,
        y: vector.y,
        z: vector.z
    };
}

function doDispose(obj) {
    if (obj !== null) {
        for (var i = 0; i < obj.children.length; i++) {
            doDispose(obj.children[i]);
        }
        if (obj.geometry) {
            obj.geometry.dispose();
            obj.geometry = undefined;
        }
        if (obj.material) {
            if (obj.material.map) {
                obj.material.map.dispose();
                obj.material.map = undefined;
            }
            obj.material.dispose();
            obj.material = undefined;
        }
    }
    obj = undefined;
};


