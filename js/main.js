
var container, mapcontainer, stats, controls;
var camera, mapCamera, MainScene, BackgroundScene, renderer, MapRenderer, clock, composer;
var lightpos, dirLight, angle;
var skyBox;

var objects = [];
var raycaster;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var worldObjects;
var colliding;
var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
var vertex = new THREE.Vector3();
var color = new THREE.Color();
var skyMaterial;
var landMassObject;
var collisionCheck;

var outofbounds;

var cycleDuration = 100;
var dawnDuration = 5;
var duskDuration = 5;
var D_N_Time = 0;
var rotation = 0;
var cloudMin, cloudMax = 40000;
var cloudSpeed = 400;
var cloudsGoingRight = true;
var cloudsGoingLeft = false;
var cloudDirection = 1;

// Custom global variables
var mouse = { x: 0, y: 0 };
var resolution = 3;
var octaves;
var persistance;
var lacunarity;
var seed = 13;
var noiseScale;
var offset = { x: 0, y: 0 };
var textureSize = 512;
var mouseDown = false;
var skyboxuniforms;

var playerBox;
var SpriteGroupManage;
var Clouds;
var animatedWorldObjects;

var characterList = [];
var mapScale = 50.0;
var SpriteSheetSize = new THREE.Vector2(8, 8);
var SpriteSize = 32;

var Sun;
var Moon;
var skyObject = new THREE.Object3D();
var SunMoonObject = new THREE.Object3D();
var EnviromentalSpriteSheet;

var planetData, planet,
    planetText, planetTextInfo, planetTilt, hasRings,
    PlanetMaterial, outline, planetRotationPeriod, planetSelected;

var timer = 0;
var timeLimit = .25;
var startTime = Date.now();
var transitionWidthInfo;

var SkyColors = [
    new THREE.Vector3(0.968, 0.929, 0.611), //Morning
    new THREE.Vector3(0.658, 0.705, 0.803),
    new THREE.Vector3(0.541, 0.894, 0.996), // Midday
    new THREE.Vector3(0.541, 0.894, 0.996), // Midday
    new THREE.Vector3(0.819, 0.396, 0.388), // dusk
    new THREE.Vector3(0.333, 0.168, 0.235), // Night
    new THREE.Vector3(0.113, 0.125, 0.207), // Night
    new THREE.Vector3(0.113, 0.125, 0.207), // Night
    new THREE.Vector3(0.168, 0.156, 0.278), // early morning
];

var SunColors = [
    new THREE.Vector3(0.968, 0.737, 0.611), //Morning
    new THREE.Vector3(1, 0.854, 0.019),
    new THREE.Vector3(1, 0.941, 0.141), // Midday
    new THREE.Vector3(1, 0.941, 0.141), // Midday
    new THREE.Vector3(1, 0.352, 0.058), // dusk
    new THREE.Vector3(0.878, 0.447, 0), // Night
    new THREE.Vector3(0.113, 0.125, 0.207), // Night
    new THREE.Vector3(0.113, 0.125, 0.207), // Night
    new THREE.Vector3(0.968, 0.737, 0.611), // early morning
];

var starAlpha = [
    new THREE.Vector4(0.0, 0.0, 0.0, 0.0), //Morning
    new THREE.Vector4(1, 0.0, 0.0,0.0),
    new THREE.Vector4(1, 0.941,0.0, 0.0), // Midday
    new THREE.Vector4(1, 0.941, 0.0,0.0), // Midday
    new THREE.Vector4(1, 0.352, 0.0,0.5), // dusk
    new THREE.Vector4(0.878, 0.447,0.0, 0.7), // Night
    new THREE.Vector4(0.113, 0.125, 0.0,1.0), // Night
    new THREE.Vector4(0.113, 0.125, 0.0,1.0), // Night
    new THREE.Vector4(0.968, 0.737, 0.0,0.0), // early morning
];


var skyboxuniforms =
{
    resolution: { type: "v2", value: new THREE.Vector2() },
    randomColsMults: {
        type: "v3",
        value: new THREE.Vector3(
            randomRange(0, 10),
            randomRange(0, 10),
            randomRange(0, 10))
    },
    time: { type: "f", value: 1.0 },
    _MainTex: { type: "t", value: null },
    skyCol: { type: "i", value: new THREE.Vector4(.48, .89, .90, 1) },
    alpha: { type: "f", value: 1.0 },
}

var planetUniform =
{
    indexMatrix16x16: { type: "fv1", value: DitherPattern4x4 },
    palette: { type: "v3v", value: GrayScalePallete },
    paletteSize: { type: "i", value: 8 },
    texture: { type: "t", value: null },
    extra: { type: "t", value: null },
    lightpos: { type: 'v3', value: new THREE.Vector3(0, 30, 20) },
    noTexture: { type: "i", value: 0 },
    customColorSwitch: { type: "i", value: 1 },
    customColor: { type: "i", value: new THREE.Vector4(.48, .89, .90, 1) }
};

var sundata =
{
    radius: 1.5424, tilt: 0, N1: 125.1228, N2: 0,
    i1: 10.6, i2: 0, w1: 318.0634, w2: 0.1643573223,
    a1: 0.5, a2: 0, e1: 0, e2: 0,
    M1: 115.3654, M2: 13.0649929509, period: 1, moonSize: "",
    moonObject: "", material: "", selected: false,
    moonOrbit: 0, orbitSpeedMult: 2, inMoon: false, text: false
}

var ShaderLoadList =
{
    planet: new Shader
        (
        ),
}

init();
animate();

function Shader(vertex, fragment) {
    this.vertex = vertex;
    this.fragment = fragment;
}

//Yummy Yum Yum
function textParse(glsl, shadow_text, dither_text) {
    var text = glsl.replace("AddShadow", shadow_text);
    text = text.replace("AddDither", dither_text);

    return text;
}


function FogController() {
    var fogFarValue = controls.getObject().position.y;

    //MainScene.fog.far = fogFarValue;

    //console.log(fogFarValue);
}

function DayNightCycle(delta) {

    if (cycleDuration > 1) {
        rotation = (rotation + 360 / cycleDuration * delta) % 360;
        D_N_Time = rotation / 360;
        // roation = Euler (r, 0, 0)

        //console.log(D_N_Time);
        SetSkyColor(D_N_Time);
    }

    var nightToDay = 0.25;
    var dayToNight = 0.25;
    var dawnNormalized = dawnDuration / cycleDuration / 2.0;
    var duskNormalized = duskDuration / cycleDuration / 2.0;
    var day_to_night = (D_N_Time + nightToDay) % 1.0;
    //D_N_Time = (D_N_Time + nightToDay) % 1.0;

    // Set night and day variables depending on what time it is
    if (day_to_night > nightToDay + dawnNormalized && day_to_night < dayToNight - dawnNormalized) {
        day = true;
        night = dawn = dusk = false;
    } else {
        if (day_to_night < nightToDay - duskNormalized || day_to_night > dayToNight + duskNormalized) {
            night = true;
            day = dawn = dusk = false;
        } else {
            if (day_to_night < (nightToDay + dayToNight) / 2) {
                dawn = true;
                day = night = dusk = false;
            } else {
                dusk = true;
                day = night = dawn = false;
            }
        }
    }
    //console.log(Math.sin(D_N_Time * 3));
    //console.log("Night: " + night + " Dawn: " + dawn + " Day: " + day + " Dusk: " + dusk )
    SunMoonObject.rotation.z = ((day_to_night * 360) - 90) * Math.PI / 180;

    if (skyBox != undefined) {
        skyBox.rotation.z = ((day_to_night * 360) - 90) * Math.PI / 180;
        //skyBox.material.uniforms.alpha.value = D_N_Time;
    }


}

function SetSkyColor(d_n_time) {

    var index = (SkyColors.length * d_n_time);

    var a = SkyColors[Math.floor(index)];
    var b = SkyColors[Math.ceil(index) % SkyColors.length];

    var lerped = new THREE.Vector3();

    lerped.lerpVectors(a, b, index - Math.floor(index));

    var as = SunColors[Math.floor(index)];
    var bs = SunColors[Math.ceil(index) % SunColors .length];

    var lerpeds = new THREE.Vector3();

    lerpeds.lerpVectors(as, bs, index - Math.floor(index));

    Sun.material.color = new THREE.Color(lerpeds.x, lerpeds.y, lerpeds.z, 1.0);


    var aAlpha = starAlpha[Math.floor(index)];
    var bAlpha = starAlpha[Math.ceil(index) % starAlpha .length];

    var lerpedAlpha = new THREE.Vector4();

    lerpedAlpha.lerpVectors(aAlpha, bAlpha, index - Math.floor(index));

    Sun.material.color = new THREE.Color(lerpeds.x, lerpeds.y, lerpeds.z, 1.0);

    MainScene.fog.color = new THREE.Color(lerped.x, lerped.y, lerped.z, 0.7);


    if (skyMaterial !== undefined) {
        //console.log("poo");
        skyMaterial.uniforms.skyCol.value = new THREE.Vector4(lerped.x, lerped.y, lerped.z, 0.7);
        skyMaterial.uniforms.alpha.value = lerpedAlpha.w;
    }

    if(PlanetMaterial != undefined){
        PlanetMaterial.uniforms.customColor.value = new THREE.Vector4(lerped.x, lerped.y, lerped.z, 1.0);
    }
    //console.log(index);
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

    dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    var vector = new THREE.Vector3(750, 500, 1000);
    dirLight.position.set(vector);

    dirLight.shadow.camera.near = 0.01;
    dirLight.castShadow = true;

    var d = 550;

    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;

    dirLight.shadow.mapSize.width = 512;
    dirLight.shadow.mapSize.height = 512;

    dirLight.shadow.camera.far = 2500;
    dirLight.shadow.bias = -0.01;

    MainScene.add(dirLight);
    dirLight.position.set(1000, 1000, 1);
    controls = new THREE.PointerLockControls(camera);

    var blocker = document.getElementById('blocker');
    var instructions = document.getElementById('instructions');

    instructions.addEventListener('click', function () {

        controls.lock();

    }, false);

    controls.addEventListener('lock', function () {

        instructions.style.display = 'none';
        blocker.style.display = 'none';

    });

    controls.addEventListener('unlock', function () {

        blocker.style.display = 'block';
        instructions.style.display = '';

    });
    MainScene.add(controls.getObject());
    controls.getObject().position.set((((textureSize / 2.0) * mapScale) - 125 * mapScale),
        40, ((textureSize / 2.0) * mapScale) - 125 * mapScale);

    worldObjects = new THREE.Object3D();
    Clouds = new THREE.Object3D();
    animatedWorldObjects = new THREE.Object3D();

    collisionCheck = new Array();

    MainScene.add(worldObjects);
    MainScene.add(Clouds);
    MainScene.add(animatedWorldObjects);
    MainScene.add(SunMoonObject);
    SunMoonObject.rotation.x = 25;

    MainScene.add(mapCamera);
    //mapCamera.lookAt(controls.getObject());
    //var shadowCam = new THREE.CameraHelper(dirLight.shadow.camera);
    //MainScene.add(shadowCam);
    Clouds.position.x = 1000;

    var geometry = new THREE.BoxGeometry(5, 5, 5);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    playerBox = new THREE.Mesh(geometry, material);

    var geometry = new THREE.BoxGeometry(1000, 1000, 1000);
    var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    playerMarkerBox = new THREE.Mesh(geometry, material);


    var geometry = new THREE.BoxGeometry(((textureSize) * mapScale), 4000, (textureSize) * mapScale);
    var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    outofbounds = new THREE.Mesh(geometry, material);
    outofbounds.position.x -= (textureSize / 32) * mapScale
    outofbounds.visible = false;


    //boxHelper = new THREE.BoxHelper(outofbounds);
    //boxHelper.material.color.set(0xffffff);

    MainScene.add(outofbounds);

    //MainScene.add(playerBox);

    playerBox.add(playerMarkerBox);
    MainScene.add(playerBox);

    var gridHelper = new THREE.GridHelper(1000, 20);
    //MainScene.add(gridHelper);

    var onKeyDown = function (event) {

        switch (event.keyCode) {

            case 38: // up
            case 87: // w
                moveForward = true;
                break;

            case 37: // left
            case 65: // a
                moveLeft = true;
                break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                moveRight = true;
                break;

            case 32: // space
                if (canJump === true) velocity.y += 350;
                canJump = false;
                break;

        }

    };

    var onKeyUp = function (event) {

        switch (event.keyCode) {

            case 38: // up
            case 87: // w
                moveForward = false;
                break;

            case 37: // left
            case 65: // a
                moveLeft = false;
                break;

            case 40: // down
            case 83: // s
                moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                moveRight = false;
                break;

        }

    };

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);
    raycaster_F = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, -1), 0, 1000);
    raycaster_U = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0);
    //LoadAssets();
    //Load Shaders and Setup Planet
    ShaderLoader('js/Shaders/Planet/Planet.vs.glsl',
        'js/Shaders/Planet/Planet.fs.glsl', setUpPlanet, true);

    //camera.position.y = -40;
    container = document.getElementById('webGL-container');
    document.body.appendChild(container);

    renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });

    renderer.setSize(Math.round(window.innerWidth / resolution), Math.round(window.innerHeight / resolution));

    renderer.setClearColor(0x000000, 0);
    document.body.appendChild(renderer.domElement);
    renderer.autoClear = false;
    renderer.domElement.style.width = Math.round(renderer.domElement.width * resolution) + 'px';
    renderer.domElement.style.height = Math.round(renderer.domElement.height * resolution) + 'px';
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = false;
    renderer.shadowMapSize = 32;
    renderer.shadowMap.renderReverseSided = false;
    renderer.shadowMap.renderSingleSided = false;

    //Map Canvas

    //mapcontainer = document.getElementById('webGL-container-map_view');
    //document.body.appendChild(mapcontainer);
//
    //MapRenderer = new THREE.WebGLRenderer({ antialias: false });
    //MapRenderer.setSize(window.innerWidth / 3, window.innerWidth / 4);
    //MapRenderer.setClearColor(0x000000, 1);
    //MapRenderer.setPixelRatio(window.devicePixelRatio);
    //document.body.appendChild(MapRenderer.domElement);
    //MapRenderer.domElement.id = "Map";

    //Composer
    composer = new THREE.EffectComposer(renderer);

    var StarsRenderPass = new THREE.RenderPass(BackgroundScene, camera);
    composer.addPass(StarsRenderPass);

    var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
    composer.addPass(effectCopy);
    effectCopy.renderToScreen = true;

    var MainRenderPass = new THREE.RenderPass(MainScene, camera);
    MainRenderPass.clear = false;
    MainRenderPass.clearDepth = true;
    composer.addPass(MainRenderPass);

    MainRenderPass.renderToScreen = true;

    //Load Shaders and Setup SkyBox
    ShaderLoader('js/Shaders/Sky/Sky.vs.glsl', 'js/Shaders/Sky/Sky.fs.glsl', setUpSky, true);
    if (devicePixelRatio == 1)
        composer.setSize(window.innerWidth / resolution, window.innerHeight / resolution);
    else
        composer.setSize(window.innerWidth, window.innerHeight);


    window.addEventListener("resize", onWindowResize, false);

    stats = new Stats()

    //stats.domElement.style.position = 'absolute'
    //stats.domElement.style.left = '0px'
    //stats.domElement.style.bottom = '0px'
    //container.appendChild(stats.domElement)

    LoadCharacters(0);
    //LoadAssets();
    SetUpSunAndMoon();
}

function LoadCharacters(spriteNumber) {
    var flower = new THREE.TextureLoader().load("img/Game_File/myguys.png");
    flower.magFilter = THREE.NearestFilter;
    flower.minFilter = THREE.NearestFilter;

    var spriteMaterial = new THREE.SpriteMaterial({ map: flower, color: 0xffffff });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(115, 115, 115);

    spriteMaterial.map.offset = new THREE.Vector2(0, 0);
    spriteMaterial.map.repeat = new THREE.Vector2(1 / 8, 1 / 8);

    sprite.rotation.y = 180;
    characterList.push(sprite);
    MainScene.add(sprite);
}

function LoadCharacter(spriteNumber, url, scale, SpriteSheetSize, position) {
    console.log("the fuck?");
    var char = new THREE.TextureLoader().load(url);
    char.magFilter = THREE.NearestFilter;
    char.minFilter = THREE.NearestFilter;

    var spriteMaterial = new THREE.SpriteMaterial({ map: char, color: 0xffffff });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(scale.x, scale.y, scale.z);
    sprite.position.set(position.x, position.y, position.z);

    spriteMaterial.map.offset = new THREE.Vector2((1/SpriteSheetSize.x) * 0, (1/SpriteSheetSize.y) * 0);
    spriteMaterial.map.repeat = new THREE.Vector2((1/SpriteSheetSize.x), (1/SpriteSheetSize.y));

    return sprite;
}

function SetUpSunAndMoon() {


    var sheet = new THREE.TextureLoader().load("img/Game_File/enviromental_SpriteSheet.png");
    sheet.magFilter = THREE.NearestFilter;
    sheet.minFilter = THREE.NearestFilter;

    var SkyPosX = ((textureSize * mapScale) / 2.0) - (((textureSize * mapScale / 2.0)) / 16) + (2048 * 2);
    var SkyPosZ = ((textureSize * mapScale) / 2.0) - (((textureSize * mapScale / 2.0)) / 16) + (2048 * 2);

    var indexX = (1 / SpriteSheetSize.x);
    var indexY = (1 / SpriteSheetSize.y);
    var size = 2000;

    var sunMaterial = new THREE.SpriteMaterial({ map: sheet, color: 0xffffff });
    Sun = new THREE.Sprite(sunMaterial);
    Sun.scale.set(size, size, size);

    sunMaterial.map.offset = new THREE.Vector2(indexX * 7, indexY * 7);
    sunMaterial.map.repeat = new THREE.Vector2(indexX, indexY);
    Sun.position.set(SkyPosX, 100, 0);

    SunMoonObject.add(Sun);
    // 
    //MainScene.add(Sun);

    var sheet = new THREE.TextureLoader().load("img/Game_File/enviromental_SpriteSheet.png");
    sheet.magFilter = THREE.NearestFilter;
    sheet.minFilter = THREE.NearestFilter;

    var moonMaterial = new THREE.SpriteMaterial({ map: sheet, color: 0xffffff });
    Moon = new THREE.Sprite(moonMaterial);
    Moon.scale.set(size / 2.0, size / 2.0, size / 2.0);

    moonMaterial.map.offset = new THREE.Vector2(indexX * 7, indexY * 6);
    moonMaterial.map.repeat = new THREE.Vector2(indexX, indexY);

    Moon.position.set(-SkyPosX, 100, 0);
    SunMoonObject.add(Moon);
    //
    //BackgroundScene.add(Moon);
}

function SimpleCollision(delta) {
    colliding = false;
    var friction = 1.0;

    for (var i = 0; i < collisionCheck.length; i++) {

        var child = collisionCheck[i];
        //console.log(child);
        if (!child.isSprite) {

            if (detectCollisionCubes(child, playerBox)) {
                var childvector = new THREE.Vector3();
                childvector.setFromMatrixPosition(child.matrixWorld);

                colliding = true;

                var reflection = new THREE.Vector3();//velocity.reflect(dir);
                reflection.copy(velocity)
                reflection.reflect(velocity.normalize());


                velocity.x += reflection.x * 1.15;
                velocity.z += reflection.z * 1.15;
                break;
            }
        }
    }

    if (!detectCollisionCubes(outofbounds, playerBox)) {
        colliding = true;

        var reflection = new THREE.Vector3();//velocity.reflect(dir);
        reflection.copy(velocity)
        reflection.reflect(velocity.normalize());


        velocity.x += reflection.x * 1.15;
        velocity.z += reflection.z * 1.15;
    }

}

function detectCollisionCubes(object1, object2) {
    object1.geometry.computeBoundingBox(); //not needed if its already calculated
    object2.geometry.computeBoundingBox();
    object1.updateMatrixWorld();
    object2.updateMatrixWorld();

    var box1 = object1.geometry.boundingBox.clone();
    box1.applyMatrix4(object1.matrixWorld);

    var box2 = object2.geometry.boundingBox.clone();
    box2.applyMatrix4(object2.matrixWorld);

    return box1.intersectsBox(box2);
}

function GetCharHeight(raycaster, vector) {

    var NewVector = new THREE.Vector3(
        vector.x,
        0,
        vector.z);

    raycaster.ray.origin.copy(NewVector);
    raycaster.ray.origin.y -= 1;

    var intersections = raycaster.intersectObjects(objects);

    var onObject = intersections.length > 0;
    var height = 0;

    if (intersections[0] !== undefined) {
        height = intersections[0].point.y;
    }
    else {
        height = 40;

    }
    return height;
}

function GetCharHeightAndOrientation(raycaster, vector) {

    var NewVector = new THREE.Vector3(
        vector.x,
        0,
        vector.z);

    raycaster.ray.origin.copy(NewVector);
    raycaster.ray.origin.y -= 1;

    var intersections = raycaster.intersectObjects(objects);

    var onObject = intersections.length > 0;
    var height = 0;
    var axs = new THREE.Vector3(0, 1, 0);
    var rads = 1.0;



    if (intersections[0] !== undefined) {
        height = intersections[0].point.y;

        if (intersections[2] !== undefined) {
            var vec = intersections[2].face.normal.clone();

            var up = new THREE.Vector3(0, 1, 0);

            // we want the cone to point in the direction of the face normal
            // determine an axis to rotate around
            // cross will not work if vec == +up or -up, so there is a special case
            if (vec.y == 1 || vec.y == -1) {
                var axis = new THREE.Vector3(1, 0, 0);
            } else {
                var axis = new THREE.Vector3().crossVectors(up, vec);
            }

            //determine the amount to rotate
            var radians = Math.acos(vec.dot(up));

            axs = axis;
            rads = radians;
        }
    }
    else {
        height = 40;

    }
    return { y: height, axis: axs, radians: rads };
}

function GetHeight() {

    var vector = new THREE.Vector3(
        controls.getObject().position.x,
        0,
        controls.getObject().position.z);

    raycaster_U.ray.origin.copy(vector);
    raycaster_U.ray.origin.y -= 1;

    var intersections = raycaster_U.intersectObjects(objects);

    var onObject = intersections.length > 0;
    var height = 0;

    if (intersections[0] !== undefined)
        height = intersections[0].point.y + 40;
    else
        height = 40;

    return height;
}

function setUpSky(start, vertex_text, fragment_text) {

    var texterLoader = new THREE.TextureLoader();

    starMap01 = texterLoader.load("img/Game_File/StarField.png");
    starMap01.magFilter = THREE.NearestFilter;
    starMap01.minFilter = THREE.NearestFilter;

    skyMaterial = new THREE.ShaderMaterial(
        {
            vertexShader: vertex_text,
            fragmentShader: fragment_text,
            uniforms: skyboxuniforms,
            side: THREE.BackSide,
            fog: true,
            transparent: true,
        });

    skyBox = new THREE.Mesh(new THREE.IcosahedronGeometry(1000,
        5), skyMaterial);

    //BackgroundScene.add(skyBox);
    skyObject.add(skyBox);

    skyBox.castShadow = false;
    skyBox.receiveShadow = false;
    skyBox.rotation.x = -25;
    skyMaterial.uniforms._MainTex.value = starMap01;
    skyMaterial.uniforms.resolution.value.x = window.innerWidth;
    skyMaterial.uniforms.resolution.value.y = window.innerHeight;
}

function DistanceCollisionManage(ObjectList, Threshold) {
    var vector = controls.getObject().position;

    if (ObjectList !== undefined) {
        ObjectList.updateMatrixWorld();
        ObjectList.traverse(function (child) {

            if (child !== ObjectList) {
                var childvector = new THREE.Vector3();
                childvector.setFromMatrixPosition(child.matrixWorld);

                if ((childvector.distanceTo(vector) > Threshold)) {

                    var index = collisionCheck.indexOf(child);
                    if (index > -1) {
                        collisionCheck.splice(index, 1);
                    }

                } else if ((childvector.distanceTo(vector) < (Threshold - 0.01))) {

                    var index = collisionCheck.indexOf(child);
                    if (index == -1) {
                        collisionCheck.push(child);
                    }

                }

            }
        });
    }
}

function ShowHideObjects(ObjectList, Threshold, doChildren = false, doDistance = true) {
    var vector = controls.getObject().position;

    if (ObjectList !== undefined) {
        ObjectList.updateMatrixWorld();
        ObjectList.traverse(function (child) {

            if (child !== ObjectList) {
                var childvector = new THREE.Vector3();
                childvector.setFromMatrixPosition(child.matrixWorld);

                if ((childvector.distanceTo(vector) > Threshold && doDistance) || FrustrumIntersection(child) == false) {
                    child.visible = false;

                    if (doChildren) {
                        child.traverse(function (children) {

                            if (child.visible)
                                children.visible = false;

                        });
                    }

                    //MainScene.remove(child);
                } else if ((childvector.distanceTo(vector) < (Threshold - 0.01) && doDistance) || FrustrumIntersection(child) == true) {
                    child.visible = true;
                    //MainScene.add(child);

                    if (doChildren) {
                        child.traverse(function (children) {

                            if (!child.visible)
                                children.visible = true;
                        });
                    }
                }

            }
        });
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

   // renderer.setSize( window.innerWidth, window.innerHeight );

    //composer.setSize(Math.round(window.innerWidth / resolution), Math.round(window.innerHeight / resolution));
    renderer.setSize(Math.round(window.innerWidth / resolution), Math.round(window.innerHeight / resolution));
    renderer.domElement.style.width = Math.round((renderer.domElement.width) * resolution) + 'px';
    renderer.domElement.style.height = Math.round((renderer.domElement.height) * resolution) + 'px';

}

function ManageCharacters() {

    for (var i = 0; i < characterList.length; i++) {

        var char = characterList[i];
        var charYAngle = (char.rotation.y) * Math.PI / 180;
        //char.position.y = GetCharHeight(new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0), char.position).y + char.scale.y / 2.0;

        var camObj = controls.getObject();

        var vector = new Vector2(char.position.z - camObj.position.z, char.position.x - camObj.position.x);
        var angle = Math.atan2(vector.y, vector.x);
        UpdateCharacterSprite(angle + charYAngle, char);
    }
}

function UpdateCharacterSprite(angle, char) {

    //Regions mapped from -1 to 1;
    var offset = Math.PI / 4;

    var dagrees = AbsoluteAngle((angle + offset) * 180 / Math.PI);

    //normaledAngle = (normaledAngle * 2) - 1;
    var normalizedAngle = dagrees / 360;

    var index = Math.ceil(((normalizedAngle * 4)) % 4) - 1;

    //console.log(index);

    char.material.map.offset = new THREE.Vector2(0.25 * (index), 0);
    // char.material.map.repeat = new THREE.Vector2(1 / 2, 1);
}//

function AbsoluteAngle(angle) {
    return (angle %= 360) >= 0 ? angle : (angle + 360);
}

function AnimateClouds(delta) {
    if (Math.abs(Clouds.position.x) > cloudMax && cloudsGoingLeft) {
        cloudDirection = 1;
        cloudsGoingLeft = false;
        cloudsGoingRight = true;
    }
    else if (Math.abs(Clouds.position.x) > cloudMax && cloudsGoingRight) {
        cloudDirection = -1;
        cloudsGoingLeft = true;
        cloudsGoingRight = false;
    }

    Clouds.position.x += (delta * cloudSpeed) * cloudDirection;


}

function animate() {


    //console.log(collisionCheck.length);

    stats.begin();
    ManageCharacters();
    FogController()

    //console.log(worldObjects);
    var delta = clock.getDelta();
    timer = timer + delta;
    DayNightCycle(delta);
    //Landmass ChunkManagement
    //ShowHideObjects(landMassObject, 2000, false, false, false);
    AnimateClouds(delta);
    //Scene and Collsion World Managment
    //ShowHideObjects(worldObjects, 3000, true);
    DistanceCollisionManage(worldObjects, 300);

    SimpleCollision(delta);



    angle += 0.1;
    //mapCamera.rotation.x  += delta;
    if (landMassObject !== undefined) {
        dirLight.lookAt(landMassObject.position);
        var elapsedMilliseconds = Date.now() - startTime;
        var elapsedSeconds = elapsedMilliseconds / 1000.;
    }

    if (skyMaterial !== undefined) {
        skyMaterial.uniforms.time.value = timer;
    }

    if(animatedWorldObjects.children.length != 0){
        //console.log(animatedWorldObjects.children.length);
     
        if(animatedWorldObjects.children[0] != undefined){
            animatedWorldObjects.children[0].material.uniforms.time.value = timer;
            //console.log("poo");
        }

    }

    Movement(delta);

    stats.end();
    requestAnimationFrame(animate);

    render();

}

function Movement(delta) {

    if (controls.isLocked === true) {

        var height = GetHeight();
        //console.log(height);

        //raycaster.ray.origin.copy(controls.getObject().position);
        //raycaster.ray.origin.y -= 10;

        //var intersections = raycaster.intersectObjects(objects);

        //var onObject = intersections.length > 0;

        //var time = performance.now();
        var delta = delta;//(time - prevTime) / 1000;

        velocity.x -= velocity.x * 2.0 * delta;
        velocity.z -= velocity.z * 2.0 * delta;

        //velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveLeft) - Number(moveRight);
        direction.normalize(); // this ensures consistent movements in all directions

        if (moveForward && !colliding || moveBackward && !colliding) velocity.z -= direction.z * 1200.0 * delta;
        if (moveLeft && !colliding || moveRight && !colliding) velocity.x -= direction.x * 1200.0 * delta;

        //if (onObject === true) {
        //    velocity.y = Math.max(0, velocity.y);
        //    canJump = true;
        //}
        controls.getObject().translateX(velocity.x * delta);
        controls.getObject().translateY(velocity.y * delta);
        controls.getObject().translateZ(velocity.z * delta);

        //if (controls.getObject().position.y <= height) {

        //    velocity.y = 0;
        //    controls.getObject().position.y = height;

        //    canJump = true;

        //}
        // console.log(height);

        if (controls.getObject().position.y !== height)
            controls.getObject().position.y = height;

        //prevTime = time;

        if (skyBox !== undefined)
            skyBox.position.copy(controls.getObject().position);

        playerBox.position.copy(controls.getObject().position);

        //var CameraVector = new THREE.Vector3(controls.getObject().position.x, mapCamera.position.y, controls.getObject().position.z)
        //mapCamera.position.copy(controls.getObject().position);
    }
}

function render() {
    //renderer.render(MainScene, camera);
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

function CalculateParametres() {
    persistance = 2.9;//randomRange(0.65, 0.85);
    lacunarity = 0.21;//randomRange(1.9, 2.2);
    octaves = 5;//Math.round(randomRange(4, 6));
    noiseScale = 3;//randomRange(10, 200);
}

function FrustrumIntersection(object) {
    var frustum = new THREE.Frustum();
    var cameraViewProjectionMatrix = new THREE.Matrix4();

    // every time the camera or objects change position (or every frame)

    camera.updateMatrixWorld(); // make sure the camera matrix is updated
    camera.matrixWorldInverse.getInverse(camera.matrixWorld);
    cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromMatrix(cameraViewProjectionMatrix);

    // frustum is now ready to check all the objects you need

    if (object.isSprite) {
        return frustum.intersectsSprite(object);
    } else {
        return frustum.intersectsObject(object);
    }

}

function CreateLand(start, vertex_text, fragment_text) {

    var vertex = vertex_text;
    var fragment = fragment_text;
    //var ico = new THREE.PlaneGeometry(1000, 1000, 32);//new THREE.IcosahedronGeometry(planetSize, 4);

    PlanetMaterial = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib['lights'],
            THREE.UniformsLib['fog'],
            planetUniform]),
        vertexShader: (vertex),
        fragmentShader: (fragment),
        lights: true,
        //wireframe:true
        fog: true
    });


    CalculateParametres();

    ShaderLoader('js/Shaders/BillBoard/BillBoard.vs.glsl',
        'js/Shaders/BillBoard/BillBoard.fs.glsl', setUpMapFirstPass, {
            octaves: octaves, persistance: persistance, lacunarity: lacunarity,
            seed: seed, noiseScale: noiseScale, offset: offset, size: textureSize, scale: mapScale, gridsize: 16,
        });
}

function PostImageData(map) {
    // create off-screen canvas element
    var canvastest = document.createElement('canvas');
    var ctx = canvastest.getContext('2d');
    document.getElementById("webGL-container-map_view").appendChild(canvastest);

    canvastest.width = textureSize;
    canvastest.height = textureSize;

    // create imageData object
    var idata = ctx.createImageData(textureSize, textureSize);

    // set our buffer as source
    //idata.data.set(map.image);
    //console.log(map);
    for (var x = 0; x < textureSize; x++) {
        for (var y = 0; y < textureSize; y++) {
            var idx = (x + y * textureSize) * 4;
            var idx2 = (x + y * textureSize) * 3;
            idata.data[idx + 0] = map.image.data[idx2 + 0];
            idata.data[idx + 1] = map.image.data[idx2 + 1];
            idata.data[idx + 2] = map.image.data[idx2 + 2];
            idata.data[idx + 3] = textureSize;
        }
    }
    // update canvas with new data
    ctx.putImageData(idata, 0, 0);
    var dataUri = canvastest.toDataURL('image/png'); // produces a PNG file

    $.ajax({
        type: 'POST',
        url: 'planet_information_post.php',
        data: {
            image: dataUri,
        },
        success: function (d) {
            console.log('done');
        }
    });
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

function createDataMap(map, size) {
    var dataTexture;

    dataTexture = new THREE.DataTexture
        (
        Uint8Array.from(map),
        size,
        size,
        THREE.RGBFormat,
        THREE.UnsignedByteType,
    );

    dataTexture.needsUpdate = true;

    return dataTexture;
}

function createPlantiodDataFirst(data, vertexShader, fragShader) {
    ShaderLoader('js/Shaders/Instance/Instance.vs.glsl',
        'js/Shaders/Instance/Instance.fs.glsl', setUpMapFinal, { data: data, vertex: vertexShader, fragment: fragShader });
}

function createPlantiodDataFinal(information, vertexShader, fragShader) {
    var ShaderInfo = { billvertex: information.vertex, billfragment: information.fragment, instavert: vertexShader, instafrag: fragShader };

    var planetInfo = new MapGenerator(information.data.octaves, information.data.persistance, information.data.lacunarity,
        information.data.seed, information.data.noiseScale, information.data.offset, information.data.size, information.data.scale, information.data.gridsize, false, worldObjects,
        collisionCheck, ShaderInfo, SpriteSheetSize, SpriteSize);

    var dataTexture;

    dataTexture = new THREE.DataTexture
        (
        Uint8Array.from(planetInfo.map),
        information.data.size,
        information.data.size,
        THREE.RGBFormat,
        THREE.UnsignedByteType,
    );

    dataTexture.needsUpdate = true;
    planetData = new PlanetInformation(dataTexture, planetInfo.hasAtmo,
        planetInfo.hasLiquad, planetInfo.colors, planetInfo.url,
        planetInfo.regionsInfo, planetInfo.LandMass);

    extraDetial = new THREE.TextureLoader().load("img/Game_File/Map_Paint.png");
    extraDetial.magFilter = THREE.NearestFilter;
    extraDetial.minFilter = THREE.NearestFilter;
    extraDetial.wrapS = THREE.RepeatWrapping;


    if (planetData != undefined) {
        landMassObject = new THREE.Object3D();

        for (var i = 0; i < planetData.LandMass.length; i++) {
            var chunk = new THREE.Mesh(planetData.LandMass[i],
                PlanetMaterial);


            chunk.castShadow = true; //default is false
            chunk.receiveShadow = true; //default
            chunk.scale.set(1, 1, 1);

            PlanetMaterial.uniforms.texture.value = planetData.map;
            PlanetMaterial.uniforms.extra.value = extraDetial;

            planetData.map.wrapS = THREE.RepeatWrapping;
            planetData.map.repeat.x = -1;

            PlanetMaterial.side = THREE.DoubleSide;
            dirLight.target = landMassObject;
            //var helper = new THREE.FaceNormalsHelper( chunk, 2, 0x00ff00, 1 );
            landMassObject.add(chunk)
            objects.push(chunk);
            //MainScene.add(helper);
        }

        //PostImageData(planetData.map);
        MainScene.add(landMassObject);
    }

    var texture, imagedata;

    var progress = document.createElement('div');
    var progressBar = document.createElement('div');

    progress.appendChild(progressBar);

    document.body.appendChild(progress);

    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        progressBar.style.width = (loaded / total * 100) + '%';
    };

    texture = new THREE.TextureLoader(manager).load("img/Game_File/Map_Decal.png", function (event) {
        imagedata = getImageData(texture.image);
        GenerateEnviromentalDecal(information.data.scale, information.data.size, imagedata, worldObjects,
            animatedWorldObjects, objects, characterList, collisionCheck, ShaderInfo, SpriteSheetSize, SpriteSize);
    });

    //GenerateClouds(Clouds, 256, ShaderInfo, SpriteSheetSize, SpriteSize);
}

// Credit to THeK3nger - https://gist.github.com/THeK3nger/300b6a62b923c913223fbd29c8b5ac73
//Sorry to any soul that bare's witness to this Abomination....May the gods have mercy on me
function ShaderLoader(vertex_url, fragment_url, onLoad, Custom, onProgress, onError) {
    var vertex_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
    vertex_loader.setResponseType('text');
    vertex_loader.load(vertex_url, function (vertex_text) {
        var fragment_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
        fragment_loader.setResponseType('text');
        fragment_loader.load(fragment_url, function (fragment_text) {
            var shadow_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
            shadow_loader.setResponseType('text');
            shadow_loader.load("js/Shaders/Shadow.glsl", function (shadow_text) {
                var dither_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
                dither_loader.setResponseType('text');
                dither_loader.load("js/Shaders/Dither.glsl", function (dither_text) {
                    onLoad(Custom, textParse(vertex_text, shadow_text, dither_text), textParse(fragment_text, shadow_text, dither_text));
                }

                )
            });
        })
    }, onProgress, onError);
}
//Methods to Setup and Save the Loaded Texts
//Aswell as pass in extra paramaratres if needed

function setUpMapFirstPass(init, vertex_text, fragment_text) {
    ShaderLoadList.planet.vertex = vertex_text;
    ShaderLoadList.planet.fragment = fragment_text;
    createPlantiodDataFirst(init, vertex_text, fragment_text);
}

function setUpMapFinal(init, vertex_text, fragment_text) {
    ShaderLoadList.planet.vertex = vertex_text;
    ShaderLoadList.planet.fragment = fragment_text;
    createPlantiodDataFinal(init, vertex_text, fragment_text);
}

function setUpPlanet(init, vertex_text, fragment_text) {
    ShaderLoadList.planet.vertex = vertex_text;
    ShaderLoadList.planet.fragment = fragment_text;
    CreateLand(init, vertex_text, fragment_text);
}

