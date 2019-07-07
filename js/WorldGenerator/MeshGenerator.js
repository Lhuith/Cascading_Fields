
const OCEAN_FLOOR = -100;


/*
	https://stackoverflow.com/questions/27426053/find-specific-point-between-2-points-three-js
	credit : fernandojsg
*/
function getPointInBetweenByLen(pointA, pointB, length) {

	var dir = pointB.clone().sub(pointA).normalize().multiplyScalar(length);
	return pointA.clone().add(dir);

}

function getPointInBetweenByPerc(pointA, pointB, percentage) {

	var dir = pointB.clone().sub(pointA);
	var len = dir.length();
	dir = dir.normalize().multiplyScalar(len * percentage);
	return pointA.clone().add(dir);
}

function face3D(p0, p1, p2, p3) {
	this.p0 = p0;
	this.p1 = p1;
	this.p2 = p2;
	this.p3 = p3;

	this.normal = new THREE.Vector3();
	this.centre = new THREE.Vector3();
	this.index = 0;
}

face3D.prototype.CalculateNormal = function (debug = false) {
	var up = new THREE.Vector3(0, 1, 0);

	//For each triangle ABC
	//// compute the cross product and add it to each vertex

	//p := cross(B-A, C-A)
	//A.n += p
	//B.n += p
	//C.n += p

	//------------------traingle 1-------------------------
	var B0_m_A0 = this.p1.clone().sub(this.p0);
	var C0_m_A0 = this.p2.clone().sub(this.p0);

	var normal0 = new THREE.Vector3().crossVectors(C0_m_A0, B0_m_A0).normalize();
	//------------------traingle 1-------------------------


	//------------------traingle 2-------------------------
	var B1_m_A1 = this.p3.clone().sub(this.p1);
	var C1_m_A1 = this.p2.clone().sub(this.p1);
	var normal1 = new THREE.Vector3().crossVectors(C1_m_A1, B1_m_A1).normalize();
	//------------------traingle 2-------------------------


	this.normal = normal1.clone().add(normal0).normalize();
	this.centre = getPointInBetweenByPerc(this.p0, this.p3, 0.5);
	//console.log(normal);

	if (debug) {
		if (this.normal.y != 1) {
			var arrowHelper = new THREE.ArrowHelper(
				this.normal, this.centre, 25, 0xff0000);
			add_to_MainScene(arrowHelper);
		}
	}

}

function GenerateTileMesh(heightMap, detialMap, heightMultiplier, _heightCurve, levelOfDetial, ChunkSize, Worldx, Worldy, mapsize, gridsize, scale, xIndex, yIndex, buffers, yoffset) {

	var bufferGeometry = new THREE.BufferGeometry();

	width = mapsize || 1;
	height = mapsize || 1;

	var width_half = width / 2;
	var height_half = height / 2;

	var gridX = Math.floor(gridsize) || 1;
	var gridY = Math.floor(gridsize) || 1;

	var gridX1 = gridX + 1;
	var gridY1 = gridY + 1;

	var segment_width = width / gridX;
	var segment_height = height / gridY;


	if (buffers != undefined) {
		var TreeBuffer = buffers.tree;
		var EnviBuffer = buffers.envi;
		var structBuffer = buffers.strct;
		var CreatureBuffer = buffers.crt;
	}
	var raySampler = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0);
	// buffers

	var indices = [];
	var vertices = [];
	var normals = [];
	var uvs = [];
	var faces = [];

	for (iy = 0; iy < gridY1; iy++) {

		var y = Math.ceil(iy * segment_height - height_half);

		//---------------------- Future verts ------------------------------
		var y1 = Math.ceil((iy + 1) * segment_height - height_half);
		//---------------------- Future verts ------------------------------

		for (ix = 0; ix < gridX1; ix++) {

			var x = Math.ceil(ix * segment_width - width_half);

			//---------------------- Future verts ------------------------------
			var x1 = Math.ceil((ix + 1) * segment_width - width_half);
			//---------------------- Future verts ------------------------------


			//------------------------ MAP SAMPLING --------------------------- \\
			var tile_size = (mapsize / scale) / gridsize;

			var grid_x = Math.floor(xIndex * tile_size) + ix;
			var grid_y = Math.floor(yIndex * tile_size) + iy;

			var grid_x1 = Math.floor(xIndex * tile_size) + (ix + 1);
			var grid_y1 = Math.floor(yIndex * tile_size) + (iy + 1);

			var rIndex = ((grid_y * ((mapsize / scale) + 1) + grid_x) * 4);

			//---------------- Forwarded Vector ----------------------
			var rIndex_x = ((grid_y * ((mapsize / scale) + 1) + grid_x1) * 4);
			var rIndex_y = ((grid_y1 * ((mapsize / scale) + 1) + grid_x) * 4);
			var Index_xy = ((grid_y1 * ((mapsize / scale) + 1) + grid_x1) * 4);
			//---------------- Forwarded Vector ----------------------

			var gIndex = ((grid_y * ((mapsize / scale) + 1) + grid_x) * 4) + 1;
			var bIndex = ((grid_y * ((mapsize / scale) + 1) + grid_x) * 4) + 2;
			var aIndex = ((grid_y * ((mapsize / scale) + 1) + grid_x) * 4) + 3;

			var color = new THREE.Vector3(
				heightMap.data[rIndex] / 255, heightMap.data[gIndex] / 255, heightMap.data[bIndex] / 255
			);

			var height = heightMap.data[rIndex] / 255;
			var height_x = heightMap.data[rIndex_x] / 255;
			var height_y = heightMap.data[rIndex_y] / 255;

			//---------------------------- Index_x+1_y+1_+0
			var height_xy = heightMap.data[Index_xy] / 255;
			//------------------------ MAP SAMPLING --------------------------- \\


			//------------------------ Normal Height -------------------------
			var finalP = EasingFunctions.easeInQuint(height);
			var finalP_x = EasingFunctions.easeInQuint(height_x);
			var finalP_y = EasingFunctions.easeInQuint(height_y);
			var finalP_xy = EasingFunctions.easeInQuint(height_xy);

			//console.log(finalP);


			finalP *= heightMultiplier;
			finalP_x *= heightMultiplier;
			finalP_y *= heightMultiplier;
			finalP_xy *= heightMultiplier;


			if (finalP <= 0.01) { finalP = - 100; }
			if (finalP_x <= 0.01) { finalP_x = - 100; }
			if (finalP_y <= 0.01) { finalP_y = - 100; }
			if (finalP_xy <= 0.01) { finalP_xy = - 100; }


			//------------------------ Normal Height -------------------------

			var obj_x = (x + Worldx + 1);
			var obj_y = (y + Worldy + 1);

			var obj_x1 = (x1 + Worldx + 1);
			var obj_y1 = (y1 + Worldy + 1);

			var uvx = ix / gridX / gridsize;
			var uvy = iy / gridX / gridsize;

			var wx = (xIndex) / gridsize;
			var wy = (yIndex) / gridsize;


			var r_d = detialMap.data[Index_xy];
			var g_d = detialMap.data[Index_xy + 1];

			//--------------------------FACE-------------------------------------
			if ((ix + 1) < gridX1 && (iy + 1) < gridY1) {
				faces.push(
					new face3D(
						new THREE.Vector3(obj_x, finalP, obj_y),
						new THREE.Vector3(obj_x1, finalP_x, obj_y),
						new THREE.Vector3(obj_x, finalP_y, obj_y1),
						new THREE.Vector3(obj_x1, finalP_xy, obj_y1),
					)
				)
				
				var curface = faces[faces.length - 1];
				curface.CalculateNormal(false);
				curface.index = Index_xy/4;
				
				if(r_d == 255) {	
						//var axis = new THREE.Vector3();
						//var up = new THREE.Vector3(0, 1, 0);
//
						//if ( curface.normal.y == 1 || curface.normal.y == -1 ) {
						//	axis = new THREE.Vector3( 1, 0, 0 );
						//}
						//else {
						//	axis = new THREE.Vector3().crossVectors( up,  curface.normal);
						//}
	//
						//// determine the amount to rotate
						//var radians = Math.acos( curface.normal.dot( up ) );
	//
						//// create a rotation matrix that implements that rotation
						//var mat = new THREE.Matrix4().makeRotationAxis( axis, radians );
//
						//// apply the rotation to the quart
						//quart = new THREE.Quaternion().setFromRotationMatrix (mat);
						////cu.rotation.getRotationFromMatrix( mat, cu.scale );
						//	
						//FetchTrees(0xff0000, 
						//	curface.centre.x, 
						//	curface.centre.y, curface.centre.z, TreeBuffer, quart, raySampler, 1);
						////FetchStructure(0x000000, 
						////	curface.centre.x, 
						////	curface.centre.y, curface.centre.z, structBuffer, quart, raySampler);
				}

				if(g_d == 255) {	
					var axis = new THREE.Vector3();
					var up = new THREE.Vector3(0, 1, 0);

					if ( curface.normal.y == 1 || curface.normal.y == -1 ) {
						axis = new THREE.Vector3( 1, 0, 0 );
					}
					else {
						axis = new THREE.Vector3().crossVectors( up,  curface.normal);
					}

					// determine the amount to rotate
					var radians = Math.acos( curface.normal.dot( up ) );

					// create a rotation matrix that implements that rotation
					var mat = new THREE.Matrix4().makeRotationAxis( axis, radians );

					// apply the rotation to the quart
					quart = new THREE.Quaternion().setFromRotationMatrix (mat);
					//cu.rotation.getRotationFromMatrix( mat, cu.scale );
						
					FetchTrees(0xff0000, 
						curface.centre.x, 
						curface.centre.y, curface.centre.z, TreeBuffer, quart, raySampler, 1);
					//FetchStructure(0x000000, 
					//	curface.centre.x, 
					//	curface.centre.y, curface.centre.z, structBuffer, quart, raySampler);
			}
			}
			//--------------------------FACE-------------------------------------

			vertices.push(obj_x, finalP + yoffset, obj_y);

			normals.push(
				faces[faces.length - 1].x,
				faces[faces.length - 1].y,
				faces[faces.length - 1].z);

			uvs.push((uvx + wx));
			uvs.push(1 - (uvy + wy));
		}
	}

	// indices
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

	bufferGeometry.setIndex(indices);
	bufferGeometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
	bufferGeometry.addAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
	bufferGeometry.addAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

	var geo = new THREE.Geometry().fromBufferGeometry(bufferGeometry);
	geo.name = "Island_" + Worldx.toString() + "_" + Worldy.toString();
	geo.mergeVertices();
	geo.computeFaceNormals();
	geo.computeVertexNormals();

	// generate vertices, normals and uvs

	

	for(var i = 0; i < faces.length; i ++){
		//console.log("FaceIndex", faces[i].index);
		//console.log("Index", i);
	}

	return geo;
}

