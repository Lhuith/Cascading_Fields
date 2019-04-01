
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

    var EnviromentBuffer = {
        offsets: [],
        orientations: [],
        vector: new THREE.Vector4(),
        scales: [],
        colors: [],
        uvoffsets: [],
        animationFrame: []
    }

    var treex, treey, treez, treew;
    var detialTexture;

    var indexX = 1 / (SpriteSheetSize.x);
    var indexY = 1 / (SpriteSheetSize.y);

    var hexIndex = [0xFFDCD5, 0xFFF0D5, 0xEDCDFF, 0xE0FFFD, 0xFF5355, 0x8EC2FE, 0x8FFBFE, 0xFFFF93];
    var grassHex = [0x61C535, 0x81D15D, 0x9ADA7D, 0xAEE197, 0xBEE7AC];
    var rockHex = [0x7B7167, 0x958D85, 0xAAA49D, 0xBBB6B1, 0xC9C5C1];

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

            //Grass
            //new Vector2(indexX * 2, indexY * 6)
            //new Vector2(indexX * randomRangeRound(0, 5), indexY * 7)
            if (hPoint > 0.35 && hPoint < 0.65) {
                if (randomRange(0, 10) > 9.2) { 
                    PopulateEnviromentBuffers(x, finalP, y, EnviromentBuffer,
                        MapToSS(randomRangeRound(0, 5), 7), grassHex[randomRangeRound(0, grassHex.length - 1)])}
            //Rocks
            } else if (hPoint > 0.7 && hPoint < 0.85) {
                if (randomRange(0, 10) > 9.2) {
                    PopulateEnviromentBuffers(x, finalP, y, EnviromentBuffer, 
                        MapToSS(randomRangeRound(0, 4), 5), rockHex[randomRangeRound(0, rockHex.length - 1)]);
                }
//
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

    CreateInstance(world, EnviromentBuffer, SpriteSheetSize, SpriteSize, ShaderInformation, 'img/Game_File/enviromental_SpriteSheet.png', true);
    return geo;
}

function PushToEnviromentBuffers(x, y, z, buffer, UVlocation, Scale, color) {

    buffer.scales.push(Scale.x, Scale.y, Scale.z);

    buffer.vector.set(x, y, z, 0).normalize();
    //EnviVector.multiplyScalar(1); // move out at least 5 units from center in current direction
    buffer.offsets.push(x + buffer.vector.x, (y + buffer.vector.y), z + buffer.vector.z);
    buffer.vector.set(x, y, z, w).normalize();
    buffer.orientations.push(0, 0, 0, 0);

    buffer.uvoffsets.push(UVlocation.x, UVlocation.y);
    buffer.colors.push(color.r, color.g, color.b);
    buffer.animationFrame.push(0, 0);
}

function PopulateEnviromentBuffers(x, y, z, buffer, uvindex, hex) {

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
    buffer.animationFrame.push(0, 0);
}
/*
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 * source : https://gist.github.com/gre/1650294
 */

function CalculateNormals() {

}

