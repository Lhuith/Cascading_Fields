function GenerateEnviromentalDecal(scale, size, imagedata, world, animatedWorld, objects, characterlist, collision, ShaderInformation, SpriteSheetSize, SpriteSize) {
    //heightMap, heightMultiplier, _heightCurve, 

    //console.log(imagedata.data.length);
    //raycaster = ;

    var SpriteSheetSizeX = SpriteSheetSize.x;//4.0;
    var SpriteSheetSizeY = SpriteSheetSize.y;//2.0;

    var ForestBuffer = {
        offsets: [],
        orientations: [],
        vector: new THREE.Vector4(),
        scales: [],
        colors: [],
        uvoffsets: [],
        animationFrame: []
    }

    var EnviromentBuffer = {
        offsets: [],
        orientations: [],
        vector: new THREE.Vector4(),
        scales: [],
        colors: [],
        uvoffsets: [],
        animationFrame: []
    }

    var StructureBuffer = {
        offsets: [],
        orientations: [],
        vector: new THREE.Vector4(),
        scales: [],
        colors: [],
        uvoffsets: [],
        animationFrame: []
    }

    var AnimatedBuffer = {
        offsets: [],
        orientations: [],
        vector: new THREE.Vector4(),
        scales: [],
        colors: [],
        uvoffsets: [],
        animationFrame: []
    }

    var CritterBuffer = {
        offsets: [],
        orientations: [],
        vector: new THREE.Vector4(),
        scales: [],
        colors: [],
        uvoffsets: [],
        animationFrame: []
    }

    var greenTreeHex = [0xB0C658, 0x4FB64F, 0x9ADA7D, 0x197F54, 0xBEE7AC];
    var flowerIndex = [0xFFDCD5, 0xFFF0D5, 0xEDCDFF, 0xE0FFFD, 0xFF5355, 0x8EC2FE, 0x8FFBFE, 0xFFFF93];

    var indexX = 1 / (SpriteSheetSize.x);
    var indexY = 1 / (SpriteSheetSize.y);
    var raySampler = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0);
    var testing = true;

    var rIndex, gIndex, bIndex, aIndex = 0;
    var red, green, blue, alpha = 0;
    var SampledColor;

    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {

           rIndex = ((i * size + j) * 4);
           gIndex = ((i * size + j) * 4) + 1;
           bIndex = ((i * size + j) * 4) + 2;
           aIndex = ((i * size + j) * 4) + 3;

           red = imagedata.data[rIndex];
           green = imagedata.data[gIndex];
           blue = imagedata.data[bIndex];
           alpha = imagedata.data[aIndex];

           SampledColor = new THREE.Color(red/255,green/255,blue/255,1.0);

            //console.log(g);
            var x = ((i * scale) - (size * scale) / 2.0) - (((size * scale / 2.0)) / 16);
            var z = ((j * scale) - (size * scale) / 2.0) - (((size * scale / 2.0)) / 16);


            //BigDude
            if (SampledColor.getHex() == 0xff4b4b) {
                var height = GetCharHeight(raySampler, new THREE.Vector3(z, 0, x));
                var char = LoadCharacter(0, 'img/Game_File/Big_Guy.png', new THREE.Vector3(1000, 1000, 1000), new THREE.Vector2(4, 4), new THREE.Vector3(z, height + 1000 / 2, x));
                char.material.fog = true;
                char.rotation.y = 90;
                world.add(char);
                characterList.push(char);
            }

            FetchCritter(SampledColor.getHex(), z, 1.0, x, CritterBuffer, raySampler);
            FetchTrees(SampledColor.getHex(), z, 1.0, x, ForestBuffer, EnviromentBuffer, raySampler, world);
            FetchEnviroment(SampledColor.getHex(), z, 1.0, x, EnviromentBuffer, raySampler);
        }
    }

    CreateInstance(world, ForestBuffer, SpriteSheetSize, SpriteSize, ShaderInformation, 'img/Game_File/Forest_SpriteSheet.png', false);
    CreateInstance(animatedWorld, CritterBuffer, SpriteSheetSize, SpriteSize, ShaderInformation, 'img/Game_File/critters.png', true, true);
    CreateInstance(world, EnviromentBuffer, SpriteSheetSize, SpriteSize, ShaderInformation, 'img/Game_File/enviromental_SpriteSheet.png', true, false);
    //CreateInstance(animatedWorld, AnimatedBuffer, SpriteSheetSize, SpriteSize, ShaderInformation, 'img/Game_File/Animated_SpriteSheet.png', true);
}


function PopulateBuffer(x, y, z, buffer, basic_object){

    var yOffets = (basic_object.size.y) / 2.0;

    buffer.scales.push(basic_object.size.x, basic_object.size.y, basic_object.size.z);

    buffer.vector.set(x, y, z, 0).normalize();

    buffer.offsets.push(x + buffer.vector.x, y + buffer.vector.y + yOffets, z + buffer.vector.z);
    buffer.vector.set(x, y, z, w).normalize();
    buffer.orientations.push(0, 0, 0, 0);

    var col = basic_object.colors[randomRangeRound(0, basic_object.colors.length - 1)];
    buffer.colors.push(col.r, col.g, col.b);

    var uvs = basic_object.ssIndex[randomRangeRound(0, basic_object.ssIndex.length - 1)];

    buffer.uvoffsets.push(uvs.x, uvs.y);

    buffer.animationFrame.push(basic_object.animationFrames.x, basic_object.animationFrames.y);
}


function MapToSS(x, y){
    return new THREE.Vector2((1/8) * x, (1/8) * y);
}

function CreateInstance(world, buffer, SpriteSheetSize, SpriteSize, ShaderInformation, url, isBill, Animate) {
    //console.log(buffer);
    var vertex;
    var fragment;

    if (isBill) {
        vertex = ShaderInformation.billvertex;
        fragment = ShaderInformation.billfragment;
    } else {
        vertex = ShaderInformation.instavert;
        fragment = ShaderInformation.instafrag;
    }

    var bufferGeometry = new THREE.PlaneBufferGeometry(1, 1, 1); //new THREE.BoxBufferGeometry( 2, 2, 2 );
    bufferGeometry.castShadow = true;
    var geometry = new THREE.InstancedBufferGeometry();
    geometry.index = bufferGeometry.index;
    geometry.attributes.position = bufferGeometry.attributes.position;
    geometry.attributes.uv = bufferGeometry.attributes.uv;

    offsetAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.offsets), 3);
    orientationAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.orientations), 4);
    colorAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.colors), 3);
    uvOffsetAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.uvoffsets), 2);
    scaleAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.scales), 3);
    animationFrameAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.animationFrame), 2);

    geometry.addAttribute('offset', offsetAttribute);
    geometry.addAttribute('orientation', orientationAttribute);
    geometry.addAttribute('col', colorAttribute);
    geometry.addAttribute('uvoffset', uvOffsetAttribute);
    geometry.addAttribute('scaleInstance', scaleAttribute);
    geometry.addAttribute('animationFrame', animationFrameAttribute);

    var texture = new THREE.TextureLoader().load(url);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    var animationSwitch = 0;

    if (Animate)
        animationSwitch = 1.0;

    var instanceUniforms = {
        map: { value: texture },
        spriteSheetX: { type: "f", value: SpriteSheetSize.x },
        spriteSheetY: { type: "f", value: SpriteSheetSize.y },
        animationSwith: { type: "f", value: animationSwitch },
        time: { type: "f", value: 1.0 }
    }

    var material = new THREE.RawShaderMaterial({
        uniforms:
            THREE.UniformsUtils.merge([
                THREE.UniformsLib['light'],
                THREE.UniformsLib['fog'],
                instanceUniforms
            ]),

        vertexShader: vertex,
        fragmentShader: fragment,
        fog: true,
    });

    mesh = new THREE.Mesh(geometry, material);
    // object3d.castShadow = true;
    material.uniforms.map.value = texture;
    material.uniforms.map.repeat = new THREE.Vector2(1 / SpriteSheetSize.x, 1 / SpriteSheetSize.y);
    material.uniforms.spriteSheetX.value = SpriteSheetSize.x;
    material.uniforms.spriteSheetY.value = SpriteSheetSize.y;
    material.side = THREE.DoubleSide;
    mesh.frustumCulled = false;
    mesh.castShadow = true;
    world.add(mesh);
}

function PopulateStructureBuffers(x, y, z, buffer, AnimatedBuffer, spriteSheetSize, SpriteSize, collision, world, uvIndex) {

    w = 0;

    var scale = new THREE.Vector3(100, 100, 100);

    var Yoffset = (16);
    var spriteSize = 32 * 2;

    var indexX = 1 / (spriteSheetSize.x);
    var indexY = 1 / (spriteSheetSize.y);

    // + Yoffset
    CreateStructureFace(x, y + Yoffset, z, buffer, scale, new THREE.Vector4(0, 0, 0, 0), spriteSheetSize, SpriteSize, collision, world, uvIndex);
    CreateStructureFace(x, y + Yoffset, z, buffer, scale, new THREE.Vector4(0, 0.707, 0, 0.707), spriteSheetSize, SpriteSize, collision, world, uvIndex);
    CreateStructureFace(x, y + Yoffset, z, buffer, scale, new THREE.Vector4(0, 0.924, 0, 0.383), spriteSheetSize, SpriteSize, collision, world, uvIndex);
    CreateStructureFace(x, y + Yoffset, z, buffer, scale, new THREE.Vector4(0, 0.383, 0, 0.924), spriteSheetSize, SpriteSize, collision, world, uvIndex);

    var baseH = spriteSize + Yoffset + 6;///y + Yoffset;

    var xOffset = 12;
    var zOffset = 12;

    CreateStructureFaceHead(x, y + baseH, z + zOffset, buffer, scale, new THREE.Vector4(0, 0.0, 0, 0.0), spriteSheetSize, SpriteSize, collision, world, uvIndex);
    CreateStructureFaceHead(x, y + baseH, z - zOffset, buffer, scale, new THREE.Vector4(0, 0.0, 0, 0.0), spriteSheetSize, SpriteSize, collision, world, uvIndex);

    CreateStructureFaceHead(x + xOffset, y + baseH, z, buffer, scale, new THREE.Vector4(0, 0.707, 0, 0.707), spriteSheetSize, SpriteSize, collision, world, uvIndex);
    CreateStructureFaceHead(x - xOffset, y + baseH, z, buffer, scale, new THREE.Vector4(0, 0.707, 0, 0.707), spriteSheetSize, SpriteSize, collision, world, uvIndex);

    PushToEnviromentBuffers(x, y + Yoffset + baseH - 32, z, AnimatedBuffer, spriteSheetSize,
        SpriteSize, new THREE.Vector2(indexX * uvIndex, indexX * 0), new THREE.Vector3(scale.x / 2.0, scale.y / 2.0, scale.z / 2.0), new THREE.Color(0xFF6F4B));

    var geometry = new THREE.BoxGeometry(25, scale.y, 25);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    //scene.add( cube );
    cube.visible = false;
    cube.position.set(x, y, z);

    //boxHelper = new THREE.BoxHelper(cube);
    //boxHelper.material.color.set(0xffffff);
    //world.add(boxHelper);
    world.add(cube);
    //collision.push()
}

function CreateStructureFaceHead(x, y, z, buffer, scale, orientation, spriteSheetSize, SpriteSize, collision, world, uvIndex) {
    //--------------------------------------------BASE------------------------------------------
    w = 0;
    buffer.scales.push(scale.x, scale.y, scale.z);
    buffer.vector.set(x, y, z, 0).normalize();
    //EnviVector.multiplyScalar(1); // move out at least 5 units from center in current direction
    buffer.offsets.push(x + buffer.vector.x, y + buffer.vector.y, z + buffer.vector.z);
    buffer.vector.set(x, y, z, w).normalize();
    buffer.orientations.push(orientation.x, orientation.y, orientation.z, orientation.y);

    var index = Math.round(randomRange(0, spriteSheetSize.x - 1));
    var col = new THREE.Color(0xFFA54F);

    var indexX = 1 / (spriteSheetSize.x);
    var indexY = 1 / (spriteSheetSize.y);

    buffer.uvoffsets.push(indexX * (uvIndex + 1), indexY * uvIndex); //Select sprite at 0, 0 on grid
    buffer.colors.push(col.r, col.g, col.b);
    buffer.animationFrame.push(0, 0);
    //--------------------------------------------BASE------------------------------------------
}

function CreateStructureFace(x, y, z, buffer, scale, orientation, spriteSheetSize, SpriteSize, collision, world, uvIndex) {

    //--------------------------------------------BASE------------------------------------------
    w = 0;
    buffer.scales.push(scale.x, scale.y, scale.z);
    buffer.vector.set(x, y, z, 0).normalize();
    //EnviVector.multiplyScalar(1); // move out at least 5 units from center in current direction
    buffer.offsets.push(x + buffer.vector.x, y + buffer.vector.y, z + buffer.vector.z);
    buffer.vector.set(x, y, z, w).normalize();
    buffer.orientations.push(orientation.x, orientation.y, orientation.z, orientation.w);

    var index = Math.round(randomRange(0, spriteSheetSize.x - 1));
    var col = new THREE.Color(0xFFA54F);

    var indexX = 1 / (spriteSheetSize.x);
    var indexY = 1 / (spriteSheetSize.y);

    buffer.uvoffsets.push(indexX * uvIndex, indexY * uvIndex); //Select sprite at 0, 0 on grid
    buffer.colors.push(col.r, col.g, col.b);
    //--------------------------------------------BASE------------------------------------------
}

function PopulateCloudBuffers(x, y, z, buffer, SpriteSheetSizeX, SpriteSheetSizeY, SpriteSize, hex, multiplyScalar) {

    w = 0;
    var scaleX = 100 * multiplyScalar;//randomRange(5, 70);
    var scaleY = 100 * multiplyScalar;//scaleX;//randomRange(5, 70);
    var scaleZ = 100 * multiplyScalar;//randomRange(5, 70);

    var yOffets = 1;//(scaleY) / 2.0;

    buffer.scales.push(scaleX, scaleX, scaleZ);

    buffer.vector.set(x, y, z, 0).normalize();
    //EnviVector.multiplyScalar(1); // move out at least 5 units from center in current direction
    buffer.offsets.push(x + buffer.vector.x, y + buffer.vector.y + yOffets, z + buffer.vector.z);
    buffer.vector.set(x, y, z, w).normalize();
    buffer.orientations.push(0, 0, 0, 0);

    var col = new THREE.Color(hex);

    var indexX = 1 / (SpriteSheetSizeX);
    var indexY = 1 / (SpriteSheetSizeY);

    buffer.uvoffsets.push(indexX * 0, indexY * 4);
    buffer.colors.push(col.r, col.g, col.b);
    buffer.animationFrame.push(0, 0);
}

function GenerateClouds(CloudsHolder, size, ShaderInformation, SpriteSheetSize, SpriteSize) {
    var cloudhex = [0xA8BFD2, 0x849FB2, 0xCFD2E7];
    var SpriteSheetSizeX = SpriteSheetSize.x;//4.0;
    var SpriteSheetSizeY = SpriteSheetSize.y;//2.0;

    var CloudBuffer = {
        offsets: [],
        orientations: [],
        vector: new THREE.Vector4(),
        scales: [],
        colors: [],
        uvoffsets: []
    }
    var scale = 85.0;

    for (var i = 0; i < size; i++)
        for (var j = 0; j < size; j++) {

            var x = ((i * scale) - (size * scale) / 2.0);
            var z = ((j * scale) - (size * scale) / 2.0);
            PopulateCloudBuffers(x, 850 + randomRange(-264, 264), z, CloudBuffer, SpriteSheetSizeX, SpriteSheetSizeY, SpriteSize, 0x849FB2, randomRange(1, 4));
        }

    CreateInstance(CloudsHolder, CloudBuffer, SpriteSheetSize, SpriteSize, ShaderInformation, 'img/Game_File/enviromental_SpriteSheet.png', true);
}