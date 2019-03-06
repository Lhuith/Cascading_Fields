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

    var MushyHex = [0xF6F3EC, 0xFB985F, 0xDB4C2C, 0xAA7B47, 0xECDAC2];
    var flowerIndex = [0xFFDCD5, 0xFFF0D5, 0xEDCDFF, 0xE0FFFD, 0xFF5355, 0x8EC2FE, 0x8FFBFE, 0xFFFF93];

    var indexX = 1 / (SpriteSheetSize.x);
    var indexY = 1 / (SpriteSheetSize.y);

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
                var facedata = GetCharHeight(new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0), new THREE.Vector3(z, 0, x));
                // console.log(facedata);
                // cube.position.y = y + 25;
                //        
                //world.add( cube );
                //console.log(y);
                //console.log(imagedata.data[r]);

                if (imagedata.data[r] == 0 && imagedata.data[g] == 1 && imagedata.data[g] == 0)
                    PopulateForestBuffers(z, facedata.y, x, ForestBuffer, SpriteSheetSize, SpriteSize, collision, world,
                        EnviromentBuffer, 0, MagicForestHex[randomRangeRound(0, MagicForestHex.length - 1)], facedata, new THREE.Vector3(200, 200, 200));
                else if (imagedata.data[g] == 2)
                    PopulateForestBuffers(z, facedata.y, x, ForestBuffer, SpriteSheetSize, SpriteSize, collision, world,
                        EnviromentBuffer, 1, greenTreeHex[randomRangeRound(0, greenTreeHex.length - 1)], facedata, new THREE.Vector3(200, 200, 200));
                else if (imagedata.data[g] == 3)
                    PopulateForestBuffers(z, facedata.y, x, ForestBuffer, SpriteSheetSize, SpriteSize, collision, world,
                        EnviromentBuffer, 2, greenTreeHex[randomRangeRound(0, greenTreeHex.length - 1)], facedata, new THREE.Vector3(200, 200, 200));
                else if (imagedata.data[g] == 4)
                    PopulateForestBuffers(z, facedata.y, x, ForestBuffer, SpriteSheetSize, SpriteSize, collision, world,
                        EnviromentBuffer, 4, greenTreeHex[randomRangeRound(0, greenTreeHex.length - 1)], facedata, new THREE.Vector3(200, 200, 200));
                //Flowers
                else if (imagedata.data[r] == 243 && imagedata.data[g] == 234 && imagedata.data[b] == 32) {
                    if (randomRange(0, 10) > 7.5) {
                        PopulateEnviromentBuffers(z, facedata.y, x, EnviromentBuffer, SpriteSheetSize, SpriteSize,
                            new Vector2(indexX * randomRangeRound(0, 2), indexY * 6), flowerIndex[randomRangeRound(0, flowerIndex.length - 1)]);
                    }
                }
                //Mushies mate
                else if (imagedata.data[r] == 255 && imagedata.data[g] == 60 && imagedata.data[b] == 255) {
                    PopulateForestBuffers(z, facedata.y + 100, x, ForestBuffer, SpriteSheetSize, SpriteSize, collision, world,
                        EnviromentBuffer, 7, MushyHex[randomRangeRound(0, MushyHex.length - 1)], facedata, new THREE.Vector3(300, 300, 300), true, false);
                }
                //else if (imagedata.data[r] == 182 && imagedata.data[b] == 156) {
                //    PopulateEnviromentBuffers(z, facedata.y, x, EnviromentBuffer, SpriteSheetSize, SpriteSize,
                //        new Vector2(indexX * randomRangeRound(0, 2), indexY * 6), MushyHex[randomRangeRound(0, MushyHex.length - 1)]);
                //}


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

function PopulateForestBuffers(x, y, z, buffer, spriteSheetSize, SpriteSize, collision,
    world, EnivormentalBuffer, uvindex, hex, rotationinfo, scale, useHex = false, leaves = true) {

    w = 0;

    var scaleX = scale.x;
    var scaleY = scale.y;
    var scaleZ = scale.z;

    var Yoffset = (scaleY / 2.0) - 30; //plane size of 1 times scale of 200,
    //console.log(normal);
    //0 or 180
    var mx = new THREE.Matrix4().makeRotationAxis(rotationinfo.axis, rotationinfo.radians);
    var faceQ = new THREE.Quaternion().setFromRotationMatrix(mx);

    CreateTreeFace(x, y + Yoffset, z, buffer, spriteSheetSize, SpriteSize,
        collision, world, new THREE.Quaternion(0, 0, 0, 0), faceQ, new THREE.Vector3(scaleX, scaleY, scaleZ), uvindex, hex, useHex);

    //90

    CreateTreeFace(x, y + Yoffset, z, buffer, spriteSheetSize, SpriteSize,
        collision, world, new THREE.Quaternion(0, 0.707, 0, 0.707), faceQ, new THREE.Vector3(scaleX, scaleY, scaleZ), uvindex, hex, useHex);

    //45
    CreateTreeFace(x, y + Yoffset, z, buffer, spriteSheetSize, SpriteSize,
        collision, world, new THREE.Quaternion(0, 0.924, 0, 0.383), faceQ, new THREE.Vector3(scaleX, scaleY, scaleZ), uvindex, hex, useHex);

    CreateTreeFace(x, y + Yoffset, z, buffer, spriteSheetSize, SpriteSize,
        collision, world, new THREE.Quaternion(0, 0.383, 0, 0.924), faceQ, new THREE.Vector3(scaleX, scaleY, scaleZ), uvindex, hex, useHex);

    var indexX = 1 / (spriteSheetSize.x);
    var indexY = 1 / (spriteSheetSize.y);

    if (leaves) {
        PushToEnviromentBuffers(x, y + (Yoffset * 2.0) + scaleY / 2.0, z, EnivormentalBuffer, spriteSheetSize,
            SpriteSize, new THREE.Vector2(indexX * uvindex, indexY * 0), new THREE.Vector3(scaleX, scaleY, scaleZ), new THREE.Color(hex));
    }


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

function CreateTreeFace(x, y, z, buffer, spriteSheetSize, SpriteSize, collision, world, orientation, faceQuaternion, scale, uvIndex, hex, useHex) {
    //console.log(SpriteSize);
    var indexX = 1 / (spriteSheetSize.x);
    var indexY = 1 / (spriteSheetSize.y);

    var combined = new THREE.Quaternion();
    faceQuaternion.normalize();

    //combined.multiplyQuaternions(orientation, faceQuaternion).normalize();

    w = 0;
    buffer.scales.push(scale.x, scale.y, scale.z);
    buffer.vector.set(x, y, z, 0).normalize();
    //EnviVector.multiplyScalar(1); // move out at least 5 units from center in current direction
    buffer.offsets.push(x + buffer.vector.x, y + buffer.vector.y, z + buffer.vector.z);
    buffer.vector.set(x, y, z, w).normalize();
    buffer.orientations.push(orientation.x, orientation.y, orientation.z, orientation.w);

    var col = new THREE.Color(0xffffff);

    if (!useHex)
        col.setHex(0xAE875E);
    else
        col.setHex(hex);
    //console.log(indexX * uvIndex);
    buffer.uvoffsets.push(indexX * 0, indexY * uvIndex); //Select sprite at 0, 0 on grid
    buffer.colors.push(col.r, col.g, col.b);

    var trunkOffset = 10;

    //----------------------------TRUNK0-------------------------------------------
    w = 0;
    buffer.scales.push(scale.x, scale.y, scale.z);
    buffer.vector.set(x, y, z, 0).normalize();
    //EnviVector.multiplyScalar(1); // move out at least 5 units from center in current direction
    buffer.offsets.push(x + buffer.vector.x, y + buffer.vector.y + trunkOffset, z + buffer.vector.z);
    buffer.vector.set(x, y, z, w).normalize();
    buffer.orientations.push(orientation.x, orientation.y, orientation.z, orientation.w);

    var col = new THREE.Color(0xffffff);
    if (!useHex)
        col.setHex(0xAE875E);
    else
        col.setHex(hex);
    buffer.uvoffsets.push(indexX * 0 + (indexX), indexY * uvIndex); //Select sprite at 1, 1 on grid

    buffer.colors.push(col.r, col.g, col.b);
    //----------------------------TRUNK0-------------------------------------------

    //----------------------------Branches-------------------------------------------
    w = 0;
    buffer.scales.push(scale.x, scale.y, scale.z);
    buffer.vector.set(x, y, z, 0).normalize();
    //EnviVector.multiplyScalar(1); // move out at least 5 units from center in current direction
    buffer.offsets.push(x + buffer.vector.x, y + buffer.vector.y + trunkOffset + scale.y / 2.0, z + buffer.vector.z);
    buffer.vector.set(x, y, z, w).normalize();
    buffer.orientations.push(orientation.x, orientation.y, orientation.z, orientation.w);

    var col = new THREE.Color(0xffffff);
    if (!useHex)
        col.setHex(0xAE875E);
    else
        col.setHex(hex);
    buffer.uvoffsets.push(indexX * 0 + (indexX * 2), indexY * uvIndex); //Select sprite at 1, 1 on grid

    buffer.colors.push(col.r, col.g, col.b);
    //----------------------------Branches-------------------------------------------
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


function PopulateCloudBuffers(x, y, z, buffer, SpriteSheetSizeX, SpriteSheetSizeY, SpriteSize) {

    w = 0;
    var scaleX = 150;//randomRange(5, 70);
    var scaleY = 150;//scaleX;//randomRange(5, 70);
    var scaleZ = 150;//randomRange(5, 70);

    var yOffets = 1;//(scaleY) / 2.0;

    buffer.scales.push(scaleX, scaleX, scaleZ);

    buffer.vector.set(x, y, z, 0).normalize();
    //EnviVector.multiplyScalar(1); // move out at least 5 units from center in current direction
    buffer.offsets.push(x + buffer.vector.x, y + buffer.vector.y + yOffets, z + buffer.vector.z);
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