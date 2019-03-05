function GenerateEnviromentalDecal(scale, size, imagedata, world, animatedWorld, objects, collision, ShaderInformation, SpriteSheetSize, SpriteSize) {
    //heightMap, heightMultiplier, _heightCurve, 

    console.log(imagedata.data.length);
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
    }

    var EnviromentBuffer = {
        offsets: [],
        orientations: [],
        vector: new THREE.Vector4(),
        scales: [],
        colors: [],
        uvoffsets: [],
    }

    var StructureBuffer = {
        offsets: [],
        orientations: [],
        vector: new THREE.Vector4(),
        scales: [],
        colors: [],
        uvoffsets: []
    }

    var AnimatedBuffer = {
        offsets: [],
        orientations: [],
        vector: new THREE.Vector4(),
        scales: [],
        colors: [],
        uvoffsets: []
    }

    var greenTreeHex = [0xB0C658, 0x4FB64F, 0x9ADA7D, 0x197F54, 0xBEE7AC];

    var MagicForestHex = [0x13918F, 0x7BB16B, 0xB7B270, 0xBB6C60, 0xB05C7D];

    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {

            var r = ((i * size + j) * 4);
            var g = ((i * size + j) * 4) + 1;
            var b = ((i * size + j) * 4) + 2;
            var a = ((i * size + j) * 4) + 3;

            //console.log(g);
            var x = ((i * scale) - (size * scale) / 2.0) - (((size * scale / 2.0)) / 16);
            var z = ((j * scale) - (size * scale) / 2.0) - (((size * scale / 2.0)) / 16);

            if (imagedata.data[g] >= 1) {

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
                if(imagedata.data[g] == 1)
                    PopulateForestBuffers(z, y, x, ForestBuffer, SpriteSheetSize, SpriteSize, collision, world, EnviromentBuffer, 0, MagicForestHex[randomRangeRound(0, MagicForestHex.length - 1)]);
                else if(imagedata.data[g] == 2)
                    PopulateForestBuffers(z, y, x, ForestBuffer, SpriteSheetSize, SpriteSize, collision, world, EnviromentBuffer, 1, greenTreeHex[randomRangeRound(0, greenTreeHex.length - 1)]);

                //console.log("Tree Planted");
            } else if (imagedata.data[b] == 1) {
                var y = GetCharHeight(new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0), new THREE.Vector3(z, 0, x));
                PopulateStructureBuffers(z, y, x, StructureBuffer, AnimatedBuffer, SpriteSheetSize, SpriteSize, collision, world, 0);
            }
        }
    }

    CreateInstance(world, ForestBuffer, SpriteSheetSize, SpriteSize, ShaderInformation, 'img/Game_File/Forest_SpriteSheet.png', false);
    CreateInstance(world, StructureBuffer, SpriteSheetSize, SpriteSize, ShaderInformation, 'img/Game_File/Structures_SpriteSheet.png', false);
    CreateInstance(world, EnviromentBuffer, SpriteSheetSize, SpriteSize, ShaderInformation, 'img/Game_File/enviromental_SpriteSheet.png', true);
    CreateInstance(animatedWorld, AnimatedBuffer, SpriteSheetSize, SpriteSize, ShaderInformation, 'img/Game_File/Animated_SpriteSheet.png', true);
}

function CreateInstance(world, buffer, SpriteSheetSize, SpriteSize, ShaderInformation, url, isBill) {
    //console.log(buffer);
    var vertex;
    var fragment;

    if(isBill){
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

    geometry.addAttribute('offset', offsetAttribute);
    geometry.addAttribute('orientation', orientationAttribute);
    geometry.addAttribute('col', colorAttribute);
    geometry.addAttribute('uvoffset', uvOffsetAttribute);
    geometry.addAttribute('scaleInstance', scaleAttribute);

    var texture = new THREE.TextureLoader().load(url);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    var instanceUniforms = {
        map: { value: texture },
        spriteSheetX: { type: "f", value: SpriteSheetSize.x },
        spriteSheetY: { type: "f", value: SpriteSheetSize.y },

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

function PopulateForestBuffers(x, y, z, buffer, spriteSheetSize, SpriteSize, collision, world, EnivormentalBuffer, uvindex, hex) {

    w = 0;

    var scaleX = 200;
    var scaleY = 200;
    var scaleZ = 200;

    var Yoffset = (64);
    var spriteSize = 32 * 2;

    //0 or 180
    CreateTreeFace(x, y + Yoffset, z, buffer, spriteSheetSize, SpriteSize,
        collision, world, new THREE.Vector4(0, 0, 0, 0), new THREE.Vector3(scaleX, scaleY, scaleZ), uvindex);

    //90
    CreateTreeFace(x, y + Yoffset, z, buffer, spriteSheetSize, SpriteSize,
        collision, world, new THREE.Vector4(0, 0.707, 0, 0.707), new THREE.Vector3(scaleX, scaleY, scaleZ), uvindex);

    //45
    CreateTreeFace(x, y + Yoffset, z, buffer, spriteSheetSize, SpriteSize,
        collision, world, new THREE.Vector4(0, 0.924, 0, 0.383), new THREE.Vector3(scaleX, scaleY, scaleZ), uvindex);

    CreateTreeFace(x, y + Yoffset, z, buffer, spriteSheetSize, SpriteSize,
        collision, world, new THREE.Vector4(0, 0.383, 0, 0.924), new THREE.Vector3(scaleX, scaleY, scaleZ), uvindex);

    var indexX = 1 / (spriteSheetSize.x);
    var indexY = 1 / (spriteSheetSize.y);

    PushToEnviromentBuffers(x, y + Yoffset + spriteSize + (spriteSize / 2), z, EnivormentalBuffer, spriteSheetSize,
        SpriteSize, new THREE.Vector2(indexX * uvindex, indexX * 0), new THREE.Vector3(scaleX, scaleY, scaleZ), new THREE.Color(hex));

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

function PopulateStructureBuffers(x, y, z, buffer, AnimatedBuffer, spriteSheetSize, SpriteSize, collision, world, uvIndex) {

    w = 0;

    var scale = new THREE.Vector3(100, 100, 100);

    var Yoffset = (16);
    var spriteSize = 32 * 2;

    var indexX = 1 / (spriteSheetSize.x);
    var indexY = 1 / (spriteSheetSize.y);

    // + Yoffset
    CreateStructureFace(x, y + Yoffset, z, buffer,scale, new THREE.Vector4(0, 0, 0, 0), spriteSheetSize, SpriteSize, collision, world, uvIndex);
    CreateStructureFace(x, y + Yoffset, z, buffer,scale, new THREE.Vector4(0, 0.707, 0, 0.707), spriteSheetSize, SpriteSize, collision, world, uvIndex);
    CreateStructureFace(x, y + Yoffset, z, buffer,scale, new THREE.Vector4(0, 0.924, 0, 0.383), spriteSheetSize, SpriteSize, collision, world, uvIndex);
    CreateStructureFace(x, y + Yoffset, z, buffer,scale, new THREE.Vector4(0, 0.383, 0, 0.924), spriteSheetSize, SpriteSize, collision, world, uvIndex);
    
    var baseH = spriteSize + Yoffset + 6;///y + Yoffset;

    var xOffset = 12;
    var zOffset = 12;

    CreateStructureFaceHead(x, y + baseH, z + zOffset, buffer,scale, new THREE.Vector4(0, 0.0, 0, 0.0), spriteSheetSize, SpriteSize, collision, world, uvIndex);
    CreateStructureFaceHead(x, y + baseH, z - zOffset, buffer,scale, new THREE.Vector4(0, 0.0, 0, 0.0), spriteSheetSize, SpriteSize, collision, world, uvIndex);

    CreateStructureFaceHead(x + xOffset, y + baseH, z, buffer,scale, new THREE.Vector4(0, 0.707, 0, 0.707), spriteSheetSize, SpriteSize, collision, world, uvIndex);
    CreateStructureFaceHead(x - xOffset, y + baseH, z, buffer,scale, new THREE.Vector4(0, 0.707, 0, 0.707), spriteSheetSize, SpriteSize, collision, world, uvIndex);

    PushToEnviromentBuffers(x, y + Yoffset + baseH - 32, z, AnimatedBuffer, spriteSheetSize,
        SpriteSize, new THREE.Vector2(indexX * uvIndex, indexX * 0), new THREE.Vector3(scale.x/2.0, scale.y/2.0, scale.z/2.0), new THREE.Color(0xFF6F4B));

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

function CreateStructureFaceHead(x, y, z, buffer, scale, orientation, spriteSheetSize, SpriteSize, collision, world, uvIndex){
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
         //--------------------------------------------BASE------------------------------------------
}
function CreateStructureFace(x, y, z, buffer, scale, orientation, spriteSheetSize, SpriteSize, collision, world, uvIndex){
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

function CreateTreeFace(x, y, z, buffer, spriteSheetSize, SpriteSize, collision, world, orientation, scale, uvIndex) {
    //console.log(SpriteSize);

    w = 0;
    buffer.scales.push(scale.x, scale.y, scale.z);
    buffer.vector.set(x, y, z, 0).normalize();
    //EnviVector.multiplyScalar(1); // move out at least 5 units from center in current direction
    buffer.offsets.push(x +  buffer.vector.x, y +  buffer.vector.y, z +  buffer.vector.z);
    buffer.vector.set(x, y, z, w).normalize();
    buffer.orientations.push(orientation.x, orientation.y, orientation.z, orientation.w);

    var col = new THREE.Color(0xffffff);
    col.setHex(0xAE875E);

    var indexX = 1 / (spriteSheetSize.x);
    var indexY = 1 / (spriteSheetSize.y);

    buffer.uvoffsets.push(indexX * uvIndex, indexY * uvIndex); //Select sprite at 0, 0 on grid
    buffer.colors.push(col.r, col.g, col.b);


    //----------------------------TRUNK0-------------------------------------------
    w = 0;
    buffer.scales.push(scale.x, scale.y, scale.z);
    buffer.vector.set(x, y, z, 0).normalize();
    //EnviVector.multiplyScalar(1); // move out at least 5 units from center in current direction
    buffer.offsets.push(x + buffer.vector.x, y + buffer.vector.y, z + buffer.vector.z);
    buffer.vector.set(x, y, z, w).normalize();
    buffer.orientations.push(orientation.x, orientation.y, orientation.z, orientation.w);

    var col = new THREE.Color(0xffffff);
    col.setHex(0xAE875E);
    buffer.uvoffsets.push(indexX * (uvIndex + 1), indexY * uvIndex); //Select sprite at 1, 1 on grid

    buffer.colors.push(col.r, col.g, col.b);
    //----------------------------TRUNK0-------------------------------------------
}

function PopulateCloudBuffers(x, y, z, buffer, SpriteSheetSizeX, SpriteSheetSizeY, SpriteSize) {

    w = 0;
    var scaleX = 150;//randomRange(5, 70);
    var scaleY = 150;//scaleX;//randomRange(5, 70);
    var scaleZ = 150;//randomRange(5, 70);

    var yOffets = 1;//(scaleY) / 2.0;

    buffer.scales.push(scaleX, scaleX, scaleZ);

    buffer.vector.set(x, y, z, 0).normalize();
    //EnviVector.multiplyScalar(1); // move out at least 5 units from center in current direction
    buffer.offsets.push(x +  buffer.vector.x, y +  buffer.vector.y + yOffets, z +  buffer.vector.z);
    buffer.vector.set(x, y, z, w).normalize();
    buffer.orientations.push(0, 0, 0, 0);

    var col = new THREE.Color(0xF0F8FF);

    var indexX = 1 / (SpriteSheetSizeX);
    var indexY = 1 / (SpriteSheetSizeY);

    buffer.uvoffsets.push(indexX * 0, indexY * 4);
    buffer.colors.push(col.r, col.g, col.b);
}

function GenerateClouds(CloudsHolder, size, ShaderInformation, SpriteSheetSize, SpriteSize) {

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
            PopulateCloudBuffers(x, 750, z, CloudBuffer, SpriteSheetSizeX, SpriteSheetSizeY, SpriteSize);
        }

    CreateInstance(CloudsHolder, CloudBuffer, SpriteSheetSize, SpriteSize, ShaderInformation, 'img/Game_File/enviromental_SpriteSheet.png', true);
}