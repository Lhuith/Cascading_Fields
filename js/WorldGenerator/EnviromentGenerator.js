function GenerateEnviromentalDecal(scale, size, imagedata, world, objects, collision, ShaderInformation, SpriteSheetSize, SpriteSize) {
    //heightMap, heightMultiplier, _heightCurve, 

    console.log(imagedata.data.length);
    //raycaster = ;

    var SpriteSheetSizeX = SpriteSheetSize.x;//4.0;
    var SpriteSheetSizeY = SpriteSheetSize.y;//2.0;

    var ForestOffsets = [];
    var ForestOrientations = [];
    var ForestVector = new THREE.Vector4();
    var ForestScale = [];
    var ForestColor = [];
    var ForestUVOffset = [];

    var EnviOffsets = [];
    var EnviOrientations = [];
    var EnviVector = new THREE.Vector4();
    var EnviScale = [];
    var EnviColor = [];
    var EnviUVOffset = [];

    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {

            var r = ((i * size + j) * 4);
            var g = ((i * size + j) * 4) + 1;
            var b = ((i * size + j) * 4) + 2;
            var a = ((i * size + j) * 4) + 3;

            //console.log(g);
            var x = ((i * scale) - (size * scale) / 2.0) - (((size * scale / 2.0)) / 16);
            var z = ((j * scale) - (size * scale) / 2.0) - (((size * scale / 2.0)) / 16);
            if (imagedata.data[g] == 1) {

                //var geometry = new THREE.BoxGeometry(100, 100, 100);
                //var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
                //var cube = new THREE.Mesh( geometry, material );
                //cube.position.set(z, 0, x);
                //
                var y = GetCharHeight(new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0), new THREE.Vector3(z, 0, x));
                // cube.position.y = y + 25;
                //        
                //world.add( cube );
                //console.log(y);
                PopulateForestBuffers(z, y, x, ForestVector, ForestOffsets, ForestOrientations, ForestScale,
                    ForestColor, ForestUVOffset, SpriteSheetSizeX, SpriteSheetSizeY, SpriteSize, collision, world, {
                        EnviVector: EnviVector, EnviOffsets: EnviOffsets, EnviOrientations: EnviOrientations,
                        EnviScale: EnviScale, EnviColor: EnviColor, EnviUVOffset: EnviUVOffset
                    });

                //console.log("Tree Planted");
            }
        }
    }
    CreateForestInstance(world, ForestOffsets, ForestOrientations, ForestColor, ForestUVOffset, ForestScale, SpriteSheetSizeX, SpriteSheetSizeY, SpriteSize, ShaderInformation);
    CreateEnviromentalInstance(world, EnviOffsets, EnviOrientations, EnviColor, EnviUVOffset, EnviScale, SpriteSheetSizeX, SpriteSheetSizeY, SpriteSize, ShaderInformation);
}

function CreateForestInstance(world, offsets, orientations, colors, uvOffset, scale, SpriteSheetSizeX, SpriteSheetSizeY, SpriteSize, ShaderInformation) {

    var bufferGeometry = new THREE.PlaneBufferGeometry(1, 1, 1); //new THREE.BoxBufferGeometry( 2, 2, 2 );
    bufferGeometry.castShadow = true;
    var geometry = new THREE.InstancedBufferGeometry();
    geometry.index = bufferGeometry.index;
    geometry.attributes.position = bufferGeometry.attributes.position;
    geometry.attributes.uv = bufferGeometry.attributes.uv;

    offsetAttribute = new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3);
    orientationAttribute = new THREE.InstancedBufferAttribute(new Float32Array(orientations), 4);
    colorAttribute = new THREE.InstancedBufferAttribute(new Float32Array(colors), 3);
    uvOffsetAttribute = new THREE.InstancedBufferAttribute(new Float32Array(uvOffset), 2);
    scaleAttribute = new THREE.InstancedBufferAttribute(new Float32Array(scale), 3);

    geometry.addAttribute('offset', offsetAttribute);
    geometry.addAttribute('orientation', orientationAttribute);
    geometry.addAttribute('col', colorAttribute);
    geometry.addAttribute('uvoffset', uvOffsetAttribute);
    geometry.addAttribute('scaleInstance', scaleAttribute);

    var texture = new THREE.TextureLoader().load('img/Game_File/Forest_SpriteSheet.png');
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    var instanceUniforms = {
        map: { value: texture },
        spriteSheetX: { type: "f", value: SpriteSheetSizeX },
        spriteSheetY: { type: "f", value: SpriteSheetSizeY },

    }

    var material = new THREE.RawShaderMaterial({
        uniforms:
            THREE.UniformsUtils.merge([
                THREE.UniformsLib['light'],
                THREE.UniformsLib['fog'],
                instanceUniforms
            ]),

        vertexShader: ShaderInformation.instavert,
        fragmentShader: ShaderInformation.instafrag,
        fog: true,
    });

    mesh = new THREE.Mesh(geometry, material);
    // object3d.castShadow = true;
    material.uniforms.map.value = texture;
    material.uniforms.map.repeat = new THREE.Vector2(1 / SpriteSheetSizeX, 1 / SpriteSheetSizeY);
    material.uniforms.spriteSheetX.value = SpriteSheetSizeX;
    material.uniforms.spriteSheetY.value = SpriteSheetSizeY;
    material.side = THREE.DoubleSide;
    mesh.frustumCulled = false;
    mesh.castShadow = true;
    world.add(mesh);
}

function PopulateForestBuffers(x, y, z, ForestVector, ForestOffsets, ForestOrientations, ForestScale, ForestColor,
    ForestUVOffset, SpriteSheetSizeX, SpriteSheetSizeY, SpriteSize, collision, world, EnivormentalBuffer) {

    w = 0;

    var scaleX = 200;
    var scaleY = 200;
    var scaleZ = 200;

    var Yoffset = (64);
    var spriteSize = 32 * 2;

    //0 or 180
    CreateTreeFace(x, y + Yoffset, z, ForestVector, ForestOffsets, ForestOrientations,
        ForestScale, ForestColor, ForestUVOffset, SpriteSheetSizeX, SpriteSheetSizeY, SpriteSize,
        collision, world, new THREE.Vector4(0, 0, 0, 0), new THREE.Vector3(scaleX, scaleY, scaleZ));

    //90
    CreateTreeFace(x, y + Yoffset, z, ForestVector, ForestOffsets, ForestOrientations,
        ForestScale, ForestColor, ForestUVOffset, SpriteSheetSizeX, SpriteSheetSizeY, SpriteSize,
        collision, world, new THREE.Vector4(0, 0.707, 0, 0.707), new THREE.Vector3(scaleX, scaleY, scaleZ));

    //45
    CreateTreeFace(x, y + Yoffset, z, ForestVector, ForestOffsets, ForestOrientations,
        ForestScale, ForestColor, ForestUVOffset, SpriteSheetSizeX, SpriteSheetSizeY, SpriteSize,
        collision, world, new THREE.Vector4(0, 0.924, 0, 0.383), new THREE.Vector3(scaleX, scaleY, scaleZ));

    CreateTreeFace(x, y + Yoffset, z, ForestVector, ForestOffsets, ForestOrientations,
        ForestScale, ForestColor, ForestUVOffset, SpriteSheetSizeX, SpriteSheetSizeY, SpriteSize,
        collision, world, new THREE.Vector4(0, 0.383, 0, 0.924), new THREE.Vector3(scaleX, scaleY, scaleZ));
    
    var indexX = 1/(SpriteSheetSizeX);
    var indexY = 1/(SpriteSheetSizeY);

    PushToEnviromentBuffers(x, y + Yoffset + spriteSize + (spriteSize / 2), z, EnivormentalBuffer, SpriteSheetSizeX, SpriteSheetSizeY, 
    SpriteSize, new THREE.Vector2(indexX * 0, indexX * 0), new THREE.Vector3(scaleX, scaleY, scaleZ), new THREE.Color(0xE1B898));
    
    PushToEnviromentBuffers(x - 25, y + Yoffset + spriteSize + (spriteSize / 2), z, EnivormentalBuffer, SpriteSheetSizeX, SpriteSheetSizeY, 
    SpriteSize, new THREE.Vector2(indexX * 0, indexX * 0), new THREE.Vector3(scaleX, scaleY, scaleZ), new THREE.Color(0xE1B898));

    PushToEnviromentBuffers(x + 25, y + Yoffset + spriteSize + (spriteSize / 2), z, EnivormentalBuffer, SpriteSheetSizeX, SpriteSheetSizeY, 
    SpriteSize, new THREE.Vector2(indexX * 0, indexX * 0), new THREE.Vector3(scaleX, scaleY, scaleZ), new THREE.Color(0xE1B898));

    var geometry = new THREE.BoxGeometry(25, scaleY, 25);
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

function CreateTreeFace(x, y, z, ForestVector, ForestOffsets, ForestOrientations, ForestScale, ForestColor,
    ForestUVOffset, SpriteSheetSizeX, SpriteSheetSizeY, SpriteSize, collision, world, orientation, scale) {
    //console.log(SpriteSize);

    w = 0;
    ForestScale.push(scale.x, scale.y, scale.z);
    ForestVector.set(x, y, z, 0).normalize();
    //EnviVector.multiplyScalar(1); // move out at least 5 units from center in current direction
    ForestOffsets.push(x + ForestVector.x, y + ForestVector.y, z + ForestVector.z);
    ForestVector.set(x, y, z, w).normalize();
    ForestOrientations.push(orientation.x, orientation.y, orientation.z, orientation.w);

    var index = Math.round(randomRange(0, SpriteSheetSizeX - 1));
    var col = new THREE.Color(0xffffff);
    col.setHex(0xAE875E);

    var indexX = 1/(SpriteSheetSizeX);
    var indexY = 1/(SpriteSheetSizeY);
    ForestUVOffset.push(indexX * 0, indexY * 7); //Select sprite at 0, 0 on grid
    ForestColor.push(col.r, col.g, col.b);


    //----------------------------TRUNK0-------------------------------------------
    w = 0;
    ForestScale.push(scale.x, scale.y, scale.z);
    ForestVector.set(x, y, z, 0).normalize();
    //EnviVector.multiplyScalar(1); // move out at least 5 units from center in current direction
    ForestOffsets.push(x + ForestVector.x, y + ForestVector.y, z + ForestVector.z);
    ForestVector.set(x, y, z, w).normalize();
    ForestOrientations.push(orientation.x, orientation.y, orientation.z, orientation.w);


    var index = Math.round(randomRange(0, SpriteSheetSizeX - 1));
    var col = new THREE.Color(0xffffff);
    col.setHex(0xAE875E);
    ForestUVOffset.push(indexX * 1, indexY * 7); //Select sprite at 1, 1 on grid

    ForestColor.push(col.r, col.g, col.b);
    //----------------------------TRUNK0-------------------------------------------
}


function PopulateCloudBuffers(x, y, z, vector, offsets, orientations, scale, color,
    uvoffsets, SpriteSheetSizeX, SpriteSheetSizeY, SpriteSize) {

    w = 0;
    var scaleX = 150;//randomRange(5, 70);
    var scaleY = 150;//scaleX;//randomRange(5, 70);
    var scaleZ = 150;//randomRange(5, 70);

    var yOffets = 1;//(scaleY) / 2.0;

    scale.push(scaleX, scaleX, scaleZ);

    vector.set(x, y, z, 0).normalize();
    //EnviVector.multiplyScalar(1); // move out at least 5 units from center in current direction
    offsets.push(x + vector.x, y + vector.y + yOffets, z + vector.z);
    vector.set(x, y, z, w).normalize();
    orientations.push(0, 0, 0, 0);

    var col = new THREE.Color(0xF0F8FF);

    var indexX = 1/(SpriteSheetSizeX);
    var indexY = 1/(SpriteSheetSizeY);

    uvoffsets.push(indexX * 0, indexY * 4);
    color.push(col.r, col.g, col.b);
}

function CreateCloudInstance(world, offsets, orientations, colors, uvOffset, scale, 
    SpriteSheetSizeX, SpriteSheetSizeY, ShaderInformation, SpriteSize) {
        
    //console.log("penis");
    var bufferGeometry = new THREE.PlaneBufferGeometry(1, 1, 1); //new THREE.BoxBufferGeometry( 2, 2, 2 );
    //console.log(instances);

    var geometry = new THREE.InstancedBufferGeometry();
    geometry.index = bufferGeometry.index;
    geometry.attributes.position = bufferGeometry.attributes.position;
    geometry.attributes.uv = bufferGeometry.attributes.uv;

    offsetAttribute = new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3);
    orientationAttribute = new THREE.InstancedBufferAttribute(new Float32Array(orientations), 4);
    colorAttribute = new THREE.InstancedBufferAttribute(new Float32Array(colors), 3).setDynamic(true);
    uvOffsetAttribute = new THREE.InstancedBufferAttribute(new Float32Array(uvOffset), 2);
    scaleAttribute = new THREE.InstancedBufferAttribute(new Float32Array(scale), 3);

    geometry.addAttribute('offset', offsetAttribute);
    geometry.addAttribute('orientation', orientationAttribute);
    geometry.addAttribute('col', colorAttribute);
    geometry.addAttribute('uvoffset', uvOffsetAttribute);
    geometry.addAttribute('scaleInstance', scaleAttribute);

    var texture = new THREE.TextureLoader().load('img/Game_File/enviromental_SpriteSheet.png');
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    var instanceUniforms = {
        map: { value: texture },
        spriteSheetX: { type: "f", value: SpriteSheetSizeX },
        spriteSheetY: { type: "f", value: SpriteSheetSizeY },

    }

    var material = new THREE.RawShaderMaterial({
        uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib['lights'],
            THREE.UniformsLib['fog'],
            instanceUniforms]),
        vertexShader: ShaderInformation.billvertex,
        fragmentShader: ShaderInformation.billfragment,
        lights: true,
        fog: true,
    });

    mesh = new THREE.Mesh(geometry, material);
    console.log(material.uniforms);
    
    material.uniforms.map.value = texture;
    material.uniforms.map.repeat = new THREE.Vector2(1 / SpriteSheetSizeX, 1 / SpriteSheetSizeY);
    material.uniforms.spriteSheetX.value = SpriteSheetSizeX;
    material.uniforms.spriteSheetY.value = SpriteSheetSizeY;
    material.fog = true;
    material.needsUpdate = true;
    //material.alphaTest = 0.5;
    //material.depthTest = false;
    mesh.frustumCulled = false;
    mesh.castShadow = true; //default is false
    world.add(mesh);
}

function GenerateClouds(CloudsHolder, size, ShaderInformation, SpriteSheetSize, SpriteSize) {

    var SpriteSheetSizeX = SpriteSheetSize.x;//4.0;
    var SpriteSheetSizeY = SpriteSheetSize.y;//2.0;

    var CloudOffsets = [];
    var CloudOrientations = [];
    var CloudVector = new THREE.Vector4();
    var CloudScale = [];
    var CloudColor = [];
    var CloudUVOffset = [];
    var scale = 85.0;

    for (var i = 0; i < size; i++)
        for (var j = 0; j < size; j++) {

        var x = ((i * scale) - (size * scale) / 2.0);
        var z = ((j * scale) - (size * scale) / 2.0);
        PopulateCloudBuffers(x, 750, z, CloudVector, CloudOffsets, CloudOrientations, CloudScale,
                CloudColor, CloudUVOffset, SpriteSheetSizeX, SpriteSheetSizeY, SpriteSize);
        }

    CreateCloudInstance(CloudsHolder, CloudOffsets, CloudOrientations, CloudColor, CloudUVOffset,
        CloudScale, SpriteSheetSizeX, SpriteSheetSizeY, ShaderInformation, SpriteSize);
}