
const OCEAN_FLOOR = -100;

function GenerateTerrainMesh(heightMap, heightMultiplier, _heightCurve, levelOfDetial, ChunkSize, Worldx, Worldy, 
    mapsize, gridsize, scale) {

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

    var hPoint = 0;
    
    for (iy = 0; iy < gridY1; iy++) {

        var worldCoordY = (Worldy * (ChunkSize) - (mapsize / 2.0));

        var y = (iy * (segment_height) - height_half) + worldCoordY;

        for (ix = 0; ix < gridX1; ix++) {

            var worldCoordX = (Worldx * (ChunkSize) - (mapsize / 2.0));

            var x = (ix * (segment_width) - width_half) + worldCoordX;

            var GridSampleSize = ((mapsize / scale) / gridsize);

            var worldGridX = (((Worldx + 1) * GridSampleSize) - GridSampleSize);
            var worldGridY = (((Worldy + 1) * GridSampleSize) - GridSampleSize);

            //var yMapIndex = (iy + worldGridY);
            //var xMapIndex = (ix + worldGridX);
            
            var yMapIndex = (iy);
            var xMapIndex = (ix);

            var index = Math.round(yMapIndex * (mapsize / scale) + xMapIndex);

            //console.log(mapsize);
            rIndex =  Math.round((xMapIndex * (mapsize / scale) + yMapIndex) * 4);
            gIndex =  Math.round((xMapIndex * (mapsize / scale) + yMapIndex) * 4) + 1;
            bIndex =  Math.round((xMapIndex * (mapsize / scale) + yMapIndex) * 4) + 2;
            aIndex =  Math.round((xMapIndex * (mapsize / scale) + yMapIndex) * 4) + 3;
            
            red = heightMap.data[rIndex];
            green = heightMap.data[gIndex];
            blue = heightMap.data[bIndex];
            alpha = heightMap.data[aIndex];

            var SampledColor = new THREE.Color(red/255,green/255,blue/255,1.0);
            var mag = Normalize(0,1,Math.sqrt(SampledColor.r * SampledColor.r + SampledColor.g * SampledColor.g + SampledColor.b * SampledColor.b));
            //console.log(mag);
            hPoint = mag;//heightMap[(index)];


            var finalP = EasingFunctions.easeInQuint(hPoint) * heightMultiplier;
            //console.log(finalP);
            if (finalP <= 0.1) {
                finalP = OCEAN_FLOOR;
            }
            var vector = new THREE.Vector3(x, finalP, y);

            vertices.push(vector.x, vector.y, vector.z);
            //(2nd - 1st) / 2 + 1st)
            //var cross = new THREE.Vector3(vector1.x, vector1.y, vector1.z).cross(vector).normalize();

            //this is useless
            normals.push(0, 1, 0);
            var worldUVX = (Worldx/ (gridsize));
            var worldUVY = (Worldy/ (gridsize));

            var uvX = (ix / ChunkSize) / (gridsize / scale);
            var uvY = (iy / ChunkSize) / (gridsize / scale);

            //uvs.push(ix+ worldUVX);
            //uvs.push(iy+ worldUVY);
            //uvs.push(((uvX - 25) + ChunkSize) * - 1);
            //uvs.push((uvY + ChunkSize));

            uvs.push( ix / gridX );
			uvs.push( 1 - ( iy / gridY ) );
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
    geo.name = "Island_" + Worldx.toString() +"_"+Worldy.toString();
    geo.mergeVertices();
    geo.computeFaceNormals();
    geo.computeVertexNormals();
    //console.log(geo);
    //CreateInstance(world, EnviromentBuffer, SpriteSheetSize, SpriteSize, ShaderInformation, 'img/Game_File/enviromental_SpriteSheet.png', true);
    return geo;
}

