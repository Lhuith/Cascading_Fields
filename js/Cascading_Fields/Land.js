var resolution = 3;
var octaves;
var persistance;
var lacunarity;
var seed = 13;
var textureSize = 512;

var noiseScale;
var offset = { x: 0, y: 0 };

var mouseDown = false;

var mapScale = 50.0;
var SpriteSize = 32;

var landData, landMassObject,
    landText, landTextInfo, landTilt, hasRings,
    landMaterial, outline, landRotationPeriod, landSelected;

var landUniform =
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


function createLandDataFinal(information, vertexShader, fragShader) {
    //console.log(information);
    var ShaderInfo = { billvertex: vertexShader, billfragment: fragShader};

var landInfo = new MapGenerator(information.octaves, information.persistance, information.lacunarity,
    information.seed, information.noiseScale, information.offset, information.size, information.scale, information.gridsize, false, worldObjects,
    collisionCheck, ShaderInfo, SpriteSheetSize, SpriteSize);

var dataTexture;

dataTexture = new THREE.DataTexture
    (
        Uint8Array.from(landInfo.map),
        information.size,
        information.size,
        THREE.RGBFormat,
        THREE.UnsignedByteType,
    );

dataTexture.needsUpdate = true;

//Creating Land Information
landData = new landInformation(dataTexture, landInfo.hasAtmo,
    landInfo.hasLiquad, landInfo.colors, landInfo.url,
    landInfo.regionsInfo, landInfo.LandMass);
    extraDetial = new THREE.TextureLoader().load("img/Game_File/Map_Paint.png");
    extraDetial.magFilter = THREE.NearestFilter;
    extraDetial.minFilter = THREE.NearestFilter;
    extraDetial.wrapS = THREE.RepeatWrapping;

    ////Adding Land Masses to Scene
    //if (landData != undefined) {
    //    landMassObject = new THREE.Object3D();
//
    //    for (var i = 0; i < landData.LandMass.length; i++) {
    //        var chunk = new THREE.Mesh(landData.LandMass[i],
    //            landMaterial);
//
//
    //        chunk.castShadow = true; //default is false
    //        chunk.receiveShadow = true; //default
    //        chunk.scale.set(1, 1, 1);
//
    //        landMaterial.uniforms.texture.value = landData.map;
    //        landMaterial.uniforms.extra.value = extraDetial;
//
    //        landData.map.wrapS = THREE.RepeatWrapping;
    //        landData.map.repeat.x = -1;
//
    //        landMaterial.side = THREE.DoubleSide;
    //        dirLight.target = landMassObject;
    //        //var helper = new THREE.FaceNormalsHelper( chunk, 2, 0x00ff00, 1 );
    //        landMassObject.add(chunk)
    //        objects.push(chunk);
    //        //MainScene.add(helper);
    //    }
//
    //    MainScene.add(landMassObject);
    //}
//
    var texture, imagedata;

    var progress = document.createElement('div');
    var progressBar = document.createElement('div');

    progress.appendChild(progressBar);

    document.body.appendChild(progress);


    //Big HeadAche
    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        progressBar.style.width = (loaded / total * 100) + '%';
    };

    texture = new THREE.TextureLoader(manager).load("img/Game_File/Map_Decal.png", function (event) {
        imagedata = getImageData(texture.image);
        GenerateEnviromentalDecal(information.scale, information.size, imagedata, landMassObject,
            animatedWorldObjects, ShaderInfo, SpriteSheetSize, SpriteSize);
    });
    //Big HeadAche

    //GenerateClouds(Clouds, 256, ShaderInfo, SpriteSheetSize, SpriteSize);
}

function CreateLand(start, vertex_text, fragment_text) {

    var vertex = vertex_text;
    var fragment = fragment_text;
    //var ico = new THREE.PlaneGeometry(1000, 1000, 32);//new THREE.IcosahedronGeometry(landSize, 4);

    landMaterial = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib['lights'],
            THREE.UniformsLib['fog'],
            landUniform]),
        vertexShader: (vertex),
        fragmentShader: (fragment),
        lights: true,
        //wireframe:true
        fog: true
    });


    CalculateParametres();

    ShaderLoader('js/Shaders/BillBoard/BillBoard.vs.glsl',
        'js/Shaders/BillBoard/BillBoard.fs.glsl', setUpMapFinal, {
            octaves: octaves, persistance: persistance, lacunarity: lacunarity,
            seed: seed, noiseScale: noiseScale, offset: offset, size: textureSize, scale: mapScale, gridsize: 16,
        });
}

function CalculateParametres() {
    persistance = 2.9;//randomRange(0.65, 0.85);
    lacunarity = 0.21;//randomRange(1.9, 2.2);
    octaves = 5;//Math.round(randomRange(4, 6));
    noiseScale = 3;//randomRange(10, 200);
}

function setUpMapFinal(init, vertex_text, fragment_text) {
    ShaderLoadList.land.vertex = vertex_text;
    ShaderLoadList.land.fragment = fragment_text;
    createLandDataFinal(init, vertex_text, fragment_text);
}

function setUpLand(init, vertex_text, fragment_text) {
    ShaderLoadList.land.vertex = vertex_text;
    ShaderLoadList.land.fragment = fragment_text;
    CreateLand(init, vertex_text, fragment_text);
}
