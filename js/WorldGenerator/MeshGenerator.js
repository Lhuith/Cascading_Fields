
const OCEAN_FLOOR = -100;

function GenerateTerrainMesh(heightMap, heightMultiplier, _heightCurve, levelOfDetial, ChunkSize, Worldx, Worldy, 
    mapsize, gridsize, scale, xIndex, yIndex) {

    var bufferGeometry = new THREE.BufferGeometry();

    width = mapsize || 1;
	height = mapsize || 1;

	var width_half = width / 2;
	var height_half = height / 2;

	var gridX = Math.floor( gridsize ) || 1;
	var gridY = Math.floor( gridsize ) || 1;

	var gridX1 = gridX + 1;
	var gridY1 = gridY + 1;

	var segment_width = width / gridX;
	var segment_height = height / gridY;
	//console.log(segment_width);
	var ix, iy;

	// buffers

	var indices = [];
	var vertices = [];
	var normals = [];
	var uvs = [];

	// generate vertices, normals and uvs

	for ( iy = 0; iy < gridY1; iy ++ ) {

		var y = iy * segment_height - height_half;

		for ( ix = 0; ix < gridX1; ix ++ ) {

			var x = ix * segment_width - width_half ;

			//------------------------ MAP SAMPLING --------------------------- \\
			var tile_size = (mapsize/scale)/gridsize;
			var grid_x = Math.floor(xIndex * tile_size) + ix;
			var grid_y = Math.floor(yIndex * tile_size) + iy;

			var rIndex = ((grid_y * (256) + grid_x) * 4);

			var height_p = heightMap.data[rIndex]/255;

		
			var finalP = EasingFunctions.easeInQuint(height_p) * heightMultiplier;
			
			if(height_p <= 0){
				finalP = - 100;
			}


			//------------------------ MAP SAMPLING --------------------------- \\
			
			vertices.push( x + Worldx - 1, finalP, y + Worldy - 1);
			normals.push( 0, 0, 1 );

			normals.push(0, 1, 0);
			
			var gridsize_ = gridsize;

			var uvx = (ix / (gridX) / gridsize_);
			var uvy = (iy / (gridY) / gridsize_);

			var wx = ((xIndex /gridsize));
			var wy = ((yIndex /gridsize));

			uvs.push((uvx + wx));
			uvs.push(1 - (uvy + wy));
		}

	}

	// indices

	for ( iy = 0; iy < gridY; iy ++ ) {

		for ( ix = 0; ix < gridX; ix ++ ) {

			var a = ix + gridX1 * iy;
			var b = ix + gridX1 * ( iy + 1 );
			var c = ( ix + 1 ) + gridX1 * ( iy + 1 );
            var d = ( ix + 1 ) + gridX1 * iy;
            
			// faces
			indices.push( a, b, d );
			indices.push( b, c, d );
		}

	}

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

