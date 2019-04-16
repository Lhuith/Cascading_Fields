
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
    new THREE.Vector4(1, 0.0, 0.0, 0.0),
    new THREE.Vector4(1, 0.941, 0.0, 0.0), // Midday
    new THREE.Vector4(1, 0.941, 0.0, 0.0), // Midday
    new THREE.Vector4(1, 0.352, 0.0, 0.5), // dusk
    new THREE.Vector4(0.878, 0.447, 0.0, 0.7), // Night
    new THREE.Vector4(0.113, 0.125, 0.0, 1.0), // Night
    new THREE.Vector4(0.113, 0.125, 0.0, 1.0), // Night
    new THREE.Vector4(0.968, 0.737, 0.0, 0.0), // early morning
];

var skyBox;
var skyMaterial;
var cycleDuration = 100;
var dawnDuration = 5;
var duskDuration = 5;
var D_N_Time = 0;
var Sun;
var Moon;
var skyObject = new THREE.Object3D();
var SunMoonObject = new THREE.Object3D();


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
    var bs = SunColors[Math.ceil(index) % SunColors.length];

    var lerpeds = new THREE.Vector3();

    lerpeds.lerpVectors(as, bs, index - Math.floor(index));

    Sun.material.color = new THREE.Color(lerpeds.x, lerpeds.y, lerpeds.z, 1.0);


    var aAlpha = starAlpha[Math.floor(index)];
    var bAlpha = starAlpha[Math.ceil(index) % starAlpha.length];

    var lerpedAlpha = new THREE.Vector4();

    lerpedAlpha.lerpVectors(aAlpha, bAlpha, index - Math.floor(index));

    Sun.material.color = new THREE.Color(lerpeds.x, lerpeds.y, lerpeds.z, 1.0);

    MainScene.fog.color = new THREE.Color(lerped.x, lerped.y, lerped.z, 0.7);


    if (skyMaterial !== undefined) {
        //console.log("poo");
        skyMaterial.uniforms.skyCol.value = new THREE.Vector4(lerped.x, lerped.y, lerped.z, 0.7);
        skyMaterial.uniforms.alpha.value = lerpedAlpha.w;
    }

    if (landMaterial != undefined) {
        landMaterial.uniforms.customColor.value = new THREE.Vector4(lerped.x, lerped.y, lerped.z, 1.0);
    }
    //console.log(index);
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