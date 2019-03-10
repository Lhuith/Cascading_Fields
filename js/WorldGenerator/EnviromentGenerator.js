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
    var burnetTreeHex = [0x010103, 0x3A3839, 0x9B9AA1, 0x3C3E46, 0xB6B9C1];

    var MagicForestHex = [0x13918F, 0x7BB16B, 0xB7B270, 0xBB6C60, 0xB05C7D];

    var MushyHex = [0xF6F3EC, 0xFB985F, 0xDB4C2C, 0xAA7B47, 0xECDAC2];
    var flowerIndex = [0xFFDCD5, 0xFFF0D5, 0xEDCDFF, 0xE0FFFD, 0xFF5355, 0x8EC2FE, 0x8FFBFE, 0xFFFF93];

    var indexX = 1 / (SpriteSheetSize.x);
    var indexY = 1 / (SpriteSheetSize.y);
    var raySampler = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0);
    var testing = true;

    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {

            var r = ((i * size + j) * 4);
            var g = ((i * size + j) * 4) + 1;
            var b = ((i * size + j) * 4) + 2;
            var a = ((i * size + j) * 4) + 3;

            //console.log(g);
            var x = ((i * scale) - (size * scale) / 2.0) - (((size * scale / 2.0)) / 16);
            var z = ((j * scale) - (size * scale) / 2.0) - (((size * scale / 2.0)) / 16);


            //BigDude
            if (imagedata.data[r] == 255 && imagedata.data[g] == 75 && imagedata.data[b] == 75) {
                var height = GetCharHeight(raySampler, new THREE.Vector3(z, 0, x));
                var char = LoadCharacter(0, 'img/Game_File/Big_Guy.png', new THREE.Vector3(1000, 1000, 1000), new THREE.Vector2(4, 4), new THREE.Vector3(z, height + 1000 / 2, x));
                char.material.fog = true;
                char.rotation.y = 90;
                world.add(char);
                characterList.push(char);
            }


            //Mountain Field ----------------------------------------------------
            if (imagedata.data[r] == 159 && imagedata.data[g] == 159 && imagedata.data[b] == 159) {
                if (randomRange(0, 1) > 0.4) {
                    var facedata = GetCharHeightAndOrientation(raySampler, new THREE.Vector3(z, 0, x));
                    //console.log(facedata);
                    PopulateForestBuffers(z, facedata.y, x, ForestBuffer, SpriteSheetSize, SpriteSize, collision, world,
                        EnviromentBuffer, 1, greenTreeHex[randomRangeRound(0, greenTreeHex.length - 1)], facedata, new THREE.Vector3(200, 200, 200), false, true, 0.5, 1.0, 2.0);
                }
            }

            //Mountain Field ----------------------------------------------------
            //Crabs ----------------------------------------------------
            if (imagedata.data[r] == 255 && imagedata.data[g] == 125 && imagedata.data[b] == 255) {
                if (randomRange(0, 1) > 0.4) {
                    var height = GetCharHeight(raySampler, new THREE.Vector3(z, 0, x));
                    PopulateCrittersBuffers(z, height, x, CritterBuffer, SpriteSheetSize, SpriteSize, new THREE.Vector2(0,0), 0xff5a5b);
                }
            }
            //Crabs ----------------------------------------------------
            if (!testing) {
                //Magic Field
                if (imagedata.data[r] == 0 && imagedata.data[g] == 150 && imagedata.data[b] == 255 && imagedata.data[a] == 255) {
                    if (randomRange(0, 1) > 0.7) {
                        var facedata = GetCharHeightAndOrientation(raySampler, new THREE.Vector3(z, 0, x));
                        //console.log(facedata);
                        PopulateForestBuffers(z, facedata.y, x, ForestBuffer, SpriteSheetSize, SpriteSize, collision, world,
                            EnviromentBuffer, 0, MagicForestHex[randomRangeRound(0, MagicForestHex.length - 1)], facedata, new THREE.Vector3(200, 200, 200), false, true, 1.0, 1.0);
                    }
                }
                //
                ////Flower Field
                if (imagedata.data[r] == 255 && imagedata.data[g] == 255 && imagedata.data[b] == 0) {

                    if (randomRange(0, 10) > 9.5) {
                        var height = GetCharHeight(raySampler, new THREE.Vector3(z, 0, x));
                        PopulateEnviromentBuffers(z, height, x, EnviromentBuffer, SpriteSheetSize, SpriteSize,
                            new Vector2(indexX * Math.ceil(randomRange(0, 2)), indexY * 6), MushyHex[randomRangeRound(0, MushyHex.length - 1)]);
                    }
                }
                //Willow Tree----------------------------------------------------
                else if (imagedata.data[r] == 0 && imagedata.data[g] == 217 && imagedata.data[b] == 255) {
                    var facedata = GetCharHeightAndOrientation(raySampler, new THREE.Vector3(z, 0, x));
                    //console.log(facedata);
                    PopulateForestBuffers(z, facedata.y, x, ForestBuffer, SpriteSheetSize, SpriteSize, collision, world,
                        EnviromentBuffer, 2, greenTreeHex[randomRangeRound(0, greenTreeHex.length - 1)], facedata, new THREE.Vector3(400, 400, 400), false, true, 1);
                }
                ////Willow Tree----------------------------------------------------
                ////Dead Field----------------------------------------------------
                else if (imagedata.data[r] == 75 && imagedata.data[g] == 0 && imagedata.data[b] == 0) {
                    if (randomRange(0, 1) > 0.4) {
                        var facedata = GetCharHeightAndOrientation(raySampler, new THREE.Vector3(z, 0, x));
                        //console.log(facedata);
                        PopulateForestBuffers(z, facedata.y, x, ForestBuffer, SpriteSheetSize, SpriteSize, collision, world,
                            EnviromentBuffer, 3, burnetTreeHex[randomRangeRound(0, burnetTreeHex.length - 1)], facedata, new THREE.Vector3(200, 200, 200), true, false, randomRange(1.0, 1.75));
                    }
                }
                //stump    
                else if (imagedata.data[r] == 75 && imagedata.data[g] == 0 && imagedata.data[b] == 75) {
                    var facedata = GetCharHeightAndOrientation(raySampler, new THREE.Vector3(z, 0, x));
                    //console.log(facedata);
                    PopulateForestBuffers(z, facedata.y, x, ForestBuffer, SpriteSheetSize, SpriteSize, collision, world,
                        EnviromentBuffer, 5, burnetTreeHex[randomRangeRound(0, burnetTreeHex.length - 1)], facedata, new THREE.Vector3(150, 150, 150), true, false);
                }
                //Dead Field----------------------------------------------------

                //Casual Field //tree 04
                else if (imagedata.data[r] == 0 && imagedata.data[g] == 150 && imagedata.data[b] == 0) {
                    //if (randomRange(0, 1) > 0.7) {
                    var facedata = GetCharHeightAndOrientation(raySampler, new THREE.Vector3(z, 0, x));
                    //console.log(facedata);
                    PopulateForestBuffers(z, facedata.y, x, ForestBuffer, SpriteSheetSize, SpriteSize, collision, world,
                        EnviromentBuffer, 4, greenTreeHex[randomRangeRound(0, greenTreeHex.length - 1)], facedata, new THREE.Vector3(200, 200, 200), false, true, randomRange(1, 3));
                    //}
                }
                //Casual Field //bush
                //else if (imagedata.data[r] == 75 && imagedata.data[g] == 150 && imagedata.data[b] == 0) {
                //    if (randomRange(0, 1) > 0.7) {
                //        var facedata = GetCharHeightAndOrientation(raySampler, new THREE.Vector3(z, 0, x));
                //        //console.log(facedata);
                //        PopulateForestBuffers(z, facedata.y, x, ForestBuffer, SpriteSheetSize, SpriteSize, collision, world,
                //            EnviromentBuffer, 6, greenTreeHex[randomRangeRound(0, greenTreeHex.length - 1)], facedata, new THREE.Vector3(100, 100, 100), false, randomRangeRound(0, 1), 1);
                //    }
                //}

                //Mushies Field --------------------------
                else if (imagedata.data[r] == 150 && imagedata.data[g] == 0 && imagedata.data[b] == 255) {
                    var facedata = GetCharHeightAndOrientation(raySampler, new THREE.Vector3(z, 0, x));
                    //console.log(facedata);
                    PopulateForestBuffers(z, facedata.y, x, ForestBuffer, SpriteSheetSize, SpriteSize, collision, world,
                        EnviromentBuffer, 7, MushyHex[randomRangeRound(0, MushyHex.length - 1)], facedata, new THREE.Vector3(200, 200, 200), true, false, randomRangeRound(1.0, 2.2));
                }
                //
                //
                else if (imagedata.data[r] == 255 && imagedata.data[g] == 0 && imagedata.data[b] == 255) {
                    //
                    if (randomRange(0, 10) > 9.5) {
                        var height = GetCharHeight(raySampler, new THREE.Vector3(z, 0, x));
                        PopulateEnviromentBuffers(z, height, x, EnviromentBuffer, SpriteSheetSize, SpriteSize,
                            new Vector2(indexX * Math.ceil(randomRange(3, 6)), indexY * 6), MushyHex[randomRangeRound(0, MushyHex.length - 1)]);
                    }
                    //

                }
                //Mushies Field --------------------------
                //Magic Field ----------------------------------------------------
                //else if (imagedata.data[r] == 0 && imagedata.data[g] == 0 && imagedata.data[b] == 255) {
                //
                //    if (randomRange(0, 10) > 9.9) {
                //        var height = GetCharHeight(raySampler, new THREE.Vector3(z, 0, x));
                //        PopulateEnviromentBuffers(z, height, x, EnviromentBuffer, SpriteSheetSize, SpriteSize,
                //            new Vector2(indexX * Math.ceil(randomRange(0, 7)), indexY * 3), MushyHex[randomRangeRound(0, MushyHex.length - 1)]);
                //    } else if (randomRange(0, 10) > 9.9) {
                //        var height = GetCharHeight(raySampler, new THREE.Vector3(z, 0, x));
                //        PopulateEnviromentBuffers(z, height, x, EnviromentBuffer, SpriteSheetSize, SpriteSize,
                //            new Vector2(indexX * Math.ceil(randomRange(4, 6)), indexY * 7), MushyHex[randomRangeRound(0, MushyHex.length - 1)]);
                //    }
                //}
                //
                ////Magic Field ----------------------------------------------------

                //    //Autumn Field ----------------------------------------------------

                //else if (imagedata.data[r] == 255 && imagedata.data[g] == 125 && imagedata.data[b] == 0) {
                //
                //    if (randomRange(0, 10) > 9.9) {
                //        var height = GetCharHeight(raySampler, new THREE.Vector3(z, 0, x));
                //        PopulateEnviromentBuffers(z, height, x, EnviromentBuffer, SpriteSheetSize, SpriteSize,
                //            new Vector2(indexX * Math.ceil(randomRange(0, 4)), indexY * 2), MushyHex[randomRangeRound(0, MushyHex.length - 1)]);
                //    }
                //    //Autumn Field ----------------------------------------------------
                //}
            }
        }
    }

    CreateInstance(world, ForestBuffer, SpriteSheetSize, SpriteSize, ShaderInformation, 'img/Game_File/Forest_SpriteSheet.png', false);
    CreateInstance(animatedWorld, CritterBuffer, SpriteSheetSize, SpriteSize, ShaderInformation, 'img/Game_File/critters.png', true, true);
    CreateInstance(world, EnviromentBuffer, SpriteSheetSize, SpriteSize, ShaderInformation, 'img/Game_File/enviromental_SpriteSheet.png', true);
    //CreateInstance(animatedWorld, AnimatedBuffer, SpriteSheetSize, SpriteSize, ShaderInformation, 'img/Game_File/Animated_SpriteSheet.png', true);
}

function PopulateCrittersBuffers(x, y, z, buffer, spriteSheetSize, SpriteSize, uvindex, hex) {

    w = 0;
    var scaleX = randomRange(5, 70);
    var scaleY = scaleX;//randomRange(5, 70);
    var scaleZ = randomRange(5, 70);

    var yOffets = (scaleY) / 2.0;

    buffer.scales.push(scaleX, scaleX, scaleZ);

    buffer.vector.set(x, y, z, 0).normalize();
    //EnviVector.multiplyScalar(1); // move out at least 5 units from center in current direction
    buffer.offsets.push(x + buffer.vector.x, y + buffer.vector.y + yOffets, z + buffer.vector.z);
    buffer.vector.set(x, y, z, w).normalize();
    buffer.orientations.push(0, 0, 0, 0);

    var col = new THREE.Color(hex);
    
    buffer.uvoffsets.push(uvindex.x, uvindex.y);
    buffer.colors.push(col.r, col.g, col.b);
    buffer.animationFrame.push(2, 1);
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

function PopulateForestBuffers(x, y, z, buffer, spriteSheetSize, SpriteSize, collision,
    world, EnivormentalBuffer, uvindex, hex, rotationinfo, scale,
    useHex = false, leaves = true, trunkHeightScale = 1.0, branchHightAdjust = 0.0, leavesMult = 1.0) {

    w = 0;
    //|     | leaves 
    //|     | branches scale/2
    //|     | trunk scale/2
    //|     | roots scale/2
    //trunkHightAdjust = trunkHightAdjust/32;


    var objhalfh = scale.y / 2.0;
    var pixelSize = (scale.y / 32);

    var rootsPos = scale.y / 2.0;

    var rootSpriteDiffrence = ((scale.y) - (pixelSize * 3)) / 2.0;//has to be hardcoded for now :(

    var trunkPos = ((rootsPos + objhalfh) - rootSpriteDiffrence) - (objhalfh * trunkHeightScale);

    var branchesPos = trunkPos + (objhalfh) + ((scale.y * trunkHeightScale) / 2.0);

    var offsets = { root: rootsPos, trunk: trunkPos, branches: branchesPos };
    var hexInfo = { useHex: useHex, hex: hex };
    //0 or 180
    var mx = new THREE.Matrix4().makeRotationAxis(rotationinfo.axis, rotationinfo.radians);
    var faceQ = new THREE.Quaternion().setFromRotationMatrix(mx);

    var TrunkOveridePass = { trunkH: trunkHeightScale };
    CreateTreeFace(x, y, z, buffer, spriteSheetSize,
        new THREE.Quaternion(0, 0, 0, 0), faceQ,
        scale, uvindex, hexInfo, offsets, TrunkOveridePass);

    //90
    CreateTreeFace(x, y, z, buffer, spriteSheetSize,
        new THREE.Quaternion(0, 0.707, 0, 0.707), faceQ,
        scale, uvindex, hexInfo, offsets, TrunkOveridePass);
    //45
    CreateTreeFace(x, y, z, buffer, spriteSheetSize,
        new THREE.Quaternion(0, 0.924, 0, 0.383), faceQ,
        scale, uvindex, hexInfo, offsets, TrunkOveridePass);

    CreateTreeFace(x, y, z, buffer, spriteSheetSize,
        new THREE.Quaternion(0, 0.383, 0, 0.924), faceQ,
        scale, uvindex, hexInfo, offsets, TrunkOveridePass);

    var indexX = 1 / (spriteSheetSize.x);
    var indexY = 1 / (spriteSheetSize.y);

    if (leaves) {
        var yPos = (y + branchesPos);
        var newPos = ((scale.y) * (leavesMult - 1)) / 2.0;
        //var extrapos = newPixelsize
        PushToEnviromentBuffers(x, yPos + (objhalfh * (leavesMult - 1)), z, EnivormentalBuffer, spriteSheetSize,
            SpriteSize, new THREE.Vector2(indexX * uvindex, indexY * 0), new THREE.Vector3(scale.x * leavesMult, scale.y * leavesMult, scale.z * leavesMult), new THREE.Color(hex));
    }


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

function CreateTreeFace(x, y, z, buffer, spriteSheetSize, orientation,
    faceQuaternion, scale, uvIndex, hexInfo, scaleInfo, trunkOveride) {
    //console.log(SpriteSize);
    var indexX = 1 / (spriteSheetSize.x);
    var indexY = 1 / (spriteSheetSize.y);
    //console.log(scaleInfo);
    var combined = new THREE.Quaternion(orientation.x, orientation.y, orientation.z, orientation.w).multiply(faceQuaternion);

    buffer.scales.push(scale.x, scale.y, scale.z);
    buffer.vector.set(x, y, z, 0).normalize();
    //EnviVector.multiplyScalar(1); // move out at least 5 units from center in current direction
    buffer.offsets.push(x + buffer.vector.x, y + buffer.vector.y + scaleInfo.root, z + buffer.vector.z);
    buffer.vector.set(x, y, z, w).normalize();
    buffer.orientations.push(orientation.x, orientation.y, orientation.z, orientation.w);

    var col = new THREE.Color(0xffffff);

    if (!hexInfo.useHex)
        col.setHex(0xAE875E);
    else
        col.setHex(hexInfo.hex);
    //console.log(indexX * uvIndex);
    buffer.uvoffsets.push(indexX * 0, indexY * uvIndex); //Select sprite at 0, 0 on grid
    buffer.colors.push(col.r, col.g, col.b);
    buffer.animationFrame.push(0, 0);
    //----------------------------TRUNK-------------------------------------------

    var yScale = scale.y * trunkOveride.trunkH;

    buffer.scales.push(scale.x, yScale, scale.z);

    buffer.vector.set(x, y, z, 0).normalize();
    //EnviVector.multiplyScalar(1); // move out at least 5 units from center in current direction
    buffer.offsets.push(x + buffer.vector.x, y + buffer.vector.y + scaleInfo.trunk, z + buffer.vector.z);
    buffer.vector.set(x, y, z, w).normalize();
    buffer.orientations.push(orientation.x, orientation.y, orientation.z, orientation.w);

    var col = new THREE.Color(0xffffff);
    if (!hexInfo.useHex)
        col.setHex(0xAE875E);
    else
        col.setHex(hexInfo.hex);
    buffer.uvoffsets.push(indexX * 0 + (indexX), indexY * uvIndex); //Select sprite at 1, 1 on grid

    buffer.colors.push(col.r, col.g, col.b);
    buffer.animationFrame.push(0, 0);
    //----------------------------TRUNK-------------------------------------------

    //----------------------------Branches-------------------------------------------
    buffer.scales.push(scale.x, scale.y, scale.z);
    buffer.vector.set(x, y, z, 0).normalize();
    //EnviVector.multiplyScalar(1); // move out at least 5 units from center in current direction
    buffer.offsets.push(x + buffer.vector.x, y + buffer.vector.y + scaleInfo.branches, z + buffer.vector.z);
    buffer.vector.set(x, y, z, w).normalize();
    buffer.orientations.push(orientation.x, orientation.y, orientation.z, orientation.w);

    var col = new THREE.Color(0xffffff);
    if (!hexInfo.useHex)
        col.setHex(0xAE875E);
    else
        col.setHex(hexInfo.hex);
    buffer.uvoffsets.push(indexX * 0 + (indexX * 2), indexY * uvIndex); //Select sprite at 1, 1 on grid

    buffer.colors.push(col.r, col.g, col.b);
    buffer.animationFrame.push(0, 0);
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