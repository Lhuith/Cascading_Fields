
function GenerateTerrainMesh(heightMap, heightMultiplier, _heightCurve, levelOfDetial, ChunkSize, Worldx, Worldy, world,
    collision, ShaderInformation, mapsize, gridsize, scale, SpriteSheetSize, SpriteSize) {

    var bufferGeometry = new THREE.BufferGeometry();

    var width = ChunkSize;
    var height = ChunkSize;

    var width_half = width / 2;
    var height_half = height / 2;

    var widthSegments = levelOfDetial;
    var heightSegments = levelOfDetial;

    var gridX = Math.floor(widthSegments) || 1;
    var gridY = Math.floor(heightSegments) || 1;

    var gridX1 = gridX + 1;
    var gridY1 = gridY + 1;

    var segment_width = width / gridX;
    var segment_height = height / gridY;

    var ix, iy;

    // buffers

    var indices = [];
    var vertices = [];
    var normals = [];
    var uvs = [];

    var EnviOffsets = [];
    var EnviOrientations = [];
    var EnviVector = new THREE.Vector4();
    var EnviScale = [];
    var EnviColor = [];
    var EnviUVOffset = [];

    var ForestOffsets = [];
    var ForestOrientations = [];
    var ForestVector = new THREE.Vector4();
    var ForestScale = [];
    var ForestColor = [];
    var ForestUVOffset = [];

    var SpriteSheetSizeX = SpriteSheetSize.x;//4.0;
    var SpriteSheetSizeY = SpriteSheetSize.y;//2.0;

    var treex, treey, treez, treew;
    var detialTexture;

    var hPoint = 0;
    //65536
    var treeinstances = 0;


    for (iy = 0; iy < gridY1; iy++) {

        var worldCoordY = (Worldy * (ChunkSize) - (mapsize / 2.0));

        var y = (iy * (segment_height) - height_half) + worldCoordY;

        for (ix = 0; ix < gridX1; ix++) {

            var worldCoordX = (Worldx * (ChunkSize) - (mapsize / 2.0));

            var x = (ix * (segment_width) - width_half) + worldCoordX;

            var GridSampleSize = ((mapsize / scale) / gridsize);

            var worldGridX = (((Worldx + 1) * GridSampleSize) - GridSampleSize);
            var worldGridY = (((Worldy + 1) * GridSampleSize) - GridSampleSize);

            var yMapIndex = (iy + worldGridY);
            var xMapIndex = (ix + worldGridX);

            var index = Math.round(yMapIndex * (mapsize / scale) + xMapIndex);

            //console.log(mapsize);

            hPoint = heightMap[(index)];

            if (finalP > 0.80) {
                finalP = 0.80;
            }

            var finalP = EasingFunctions.easeInQuint(hPoint) * heightMultiplier;

            var vector = new THREE.Vector3(x, finalP, y);

            vertices.push(vector.x, vector.y, vector.z);
            //(2nd - 1st) / 2 + 1st)
            //var cross = new THREE.Vector3(vector1.x, vector1.y, vector1.z).cross(vector).normalize();

            //this is useless
            normals.push(0, 1, 0);

            var uvX = (ix / ChunkSize) / (gridsize / scale);
            var uvY = (iy / ChunkSize) / (gridsize / scale);

            var worldUVX = (Worldx / (gridsize));
            var worldUVY = (Worldy / (gridsize));

            uvs.push((uvX + worldUVX));
            uvs.push((uvY + worldUVY));

            if (hPoint > 0.35 && hPoint < 0.65) {
                if (randomRange(0, 10) > 9.5) { PopulateEnviromentBuffers(x, finalP, y, EnviVector, EnviOffsets, EnviOrientations, EnviScale, 
                    EnviColor, EnviUVOffset, SpriteSheetSizeX, SpriteSheetSizeY, SpriteSize, Math.round(randomRange(0, 2))); }

            } else if (hPoint > 0.7 && hPoint < 0.85) {
                if (randomRange(0, 10) > 9) {
                    PopulateEnviromentBuffers(x, finalP, y, EnviVector, EnviOffsets, EnviOrientations, EnviScale, EnviColor, 
                        EnviUVOffset, SpriteSheetSizeX, SpriteSheetSizeY, SpriteSize, 3);
                }

            }
        }

    }
    for (iy = 0; iy < gridY; iy++) {
        for (ix = 0; ix < gridX; ix++) {

            var a = ix + gridX1 * iy;
            var b = ix + gridX1 * (iy + 1);
            var c = (ix + 1) + gridX1 * (iy + 1);
            var d = (ix + 1) + gridX1 * iy;

            // faces
            indices.push(a, b, d);
            indices.push(b, c, d);

        }

    }
    //build geometry

    bufferGeometry.setIndex(indices);
    bufferGeometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    bufferGeometry.addAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    bufferGeometry.addAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

    var geo = new THREE.Geometry().fromBufferGeometry(bufferGeometry);

    geo.mergeVertices();
    geo.computeFaceNormals();
    geo.computeVertexNormals();

    //Add All the fucking flowers
    //god what a pain in the ass
    CreateEnviromentalInstance(world, EnviOffsets, EnviOrientations, EnviColor, EnviUVOffset, EnviScale, SpriteSheetSizeX, SpriteSheetSizeY, SpriteSize, ShaderInformation);
    //CreateForestInstance(world, ForestOffsets, ForestOrientations, ForestColor, ForestUVOffset, ForestScale, SpriteSheetSizeX, SpriteSheetSizeY, ShaderInformation);

    return geo;
}




function PushToEnviromentBuffers(x, y, z, EnivormentalBuffer, SpriteSheetSizeX, SpriteSheetSizeY, SpriteSize, UVlocation, Scale, color) {

    //console.log(EnivormentalBuffer);

    w = 0;
    EnivormentalBuffer.EnviScale.push(Scale.x, Scale.y, Scale.z);

    EnivormentalBuffer.EnviVector.set(x, y, z, 0).normalize();
    //EnviVector.multiplyScalar(1); // move out at least 5 units from center in current direction
    EnivormentalBuffer.EnviOffsets.push(x + EnivormentalBuffer.EnviVector.x, y + EnivormentalBuffer.EnviVector.y, z + EnivormentalBuffer.EnviVector.z);
    EnivormentalBuffer.EnviVector.set(x, y, z, w).normalize();
    EnivormentalBuffer.EnviOrientations.push(0, 0, 0, 0);

    EnivormentalBuffer.EnviUVOffset.push(UVlocation.x, UVlocation.y);
    EnivormentalBuffer.EnviColor.push(color.r, color.g, color.b);
}

function PopulateEnviromentBuffers(x, y, z, EnviVector, EnviOffsets, EnviOrientations, EnviScale, EnviColor,
    EnviUVOffset, SpriteSheetSizeX, SpriteSheetSizeY, SpriteSize, uvindex) {

    w = 0;
    var scaleX = randomRange(5, 70);
    var scaleY = scaleX;//randomRange(5, 70);
    var scaleZ = randomRange(5, 70);

    var yOffets = (scaleY) / 2.0;

    EnviScale.push(scaleX, scaleX, scaleZ);

    EnviVector.set(x, y, z, 0).normalize();
    //EnviVector.multiplyScalar(1); // move out at least 5 units from center in current direction
    EnviOffsets.push(x + EnviVector.x, y + EnviVector.y + yOffets, z + EnviVector.z);
    EnviVector.set(x, y, z, w).normalize();
    EnviOrientations.push(0, 0, 0, 0);


    var index = uvindex;//Math.round(randomRange(0, SpriteSheetSizeX - 1));

    var col = new THREE.Color(0xffffff);

    if (index == 0) {
        col.setHex(0xA6CA50);
    } else if (index == 3) {
        col.setHex(0xAE875E);
    } else {

        var hexIndex = [0xFFDCD5, 0xFFF0D5, 0xEDCDFF, 0xE0FFFD, 0xFF5355, 0x8EC2FE, 0x8FFBFE, 0xFFFF93];

        col.setHex(hexIndex[Math.round(randomRange(0, hexIndex.length - 1))]);
    }

    EnviUVOffset.push(index / SpriteSheetSizeX, 0.5);
    EnviColor.push(col.r, col.g, col.b);
}

function CreateEnviromentalInstance(world, offsets, orientations, colors, uvOffset, scale, SpriteSheetSizeX, SpriteSheetSizeY, SpriteSize, ShaderInformation) {

    var bufferGeometry = new THREE.PlaneBufferGeometry(1, 1, 1); //new THREE.BoxBufferGeometry( 2, 2, 2 );
    //console.log(instances);

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

    var texture = new THREE.TextureLoader().load('img/Game_File/enviromental_SpriteSheet.png');
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
                THREE.UniformsLib['fog'],
                instanceUniforms
            ]),

        vertexShader: ShaderInformation.billvertex,
        fragmentShader: ShaderInformation.billfragment,
        fog: true,
    });

    mesh = new THREE.Mesh(geometry, material);

    material.uniforms.map.value = texture;
    material.uniforms.map.repeat = new THREE.Vector2(1 / SpriteSheetSizeX, 1 / SpriteSheetSizeY);
    material.uniforms.spriteSheetX.value = SpriteSheetSizeX;
    material.uniforms.spriteSheetY.value = SpriteSheetSizeY;

    mesh.frustumCulled = false;
    mesh.castShadow = true; //default is false
    world.add(mesh);
}


/*
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 * source : https://gist.github.com/gre/1650294
 */

function CalculateNormals() {

}

EasingFunctions = {
    // no easing, no acceleration
    linear: function (t) { return t },
    // accelerating from zero velocity
    easeInQuad: function (t) { return t * t },
    // decelerating to zero velocity
    easeOutQuad: function (t) { return t * (2 - t) },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function (t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t },
    // accelerating from zero velocity 
    easeInCubic: function (t) { return t * t * t },
    // decelerating to zero velocity 
    easeOutCubic: function (t) { return (--t) * t * t + 1 },
    // acceleration until halfway, then deceleration 
    easeInOutCubic: function (t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 },
    // accelerating from zero velocity 
    easeInQuart: function (t) { return t * t * t * t },
    // decelerating to zero velocity 
    easeOutQuart: function (t) { return 1 - (--t) * t * t * t },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function (t) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t },
    // accelerating from zero velocity
    easeInQuint: function (t) { return t * t * t * t * t },
    // decelerating to zero velocity
    easeOutQuint: function (t) { return 1 + (--t) * t * t * t * t },
    // acceleration until halfway, then deceleration 
    easeInOutQuint: function (t) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t }
}


