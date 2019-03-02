
function GenerateTerrainMesh(heightMap, heightMultiplier, _heightCurve, levelOfDetial, ChunkSize, Worldx, Worldy, world, collision, SpriteManager, mapsize, gridsize, scale, Assets) {

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

    var flowerOffsets = [];
    var flowerOrientations = [];
    var treeVector = new THREE.Vector4();
    var flowerScale = [];
    var FlowerColor = [];
    var treex, treey, treez, treew;

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

            //Tree(Assets, world, vector.x, vector.y, vector.z, SpriteManager, treeinstances, flowerOffsets, flowerOrientations, vector);

            //var w = 1;
            //instance += 1;
            treex = x;
            treey = finalP;
            treez = y;
            treew = 0;

            treeVector.set(treex, treey, treez, 0).normalize();
            //treeVector.multiplyScalar(1); // move out at least 5 units from center in current direction
            flowerOffsets.push(treex + treeVector.x, treey + treeVector.y, treez + treeVector.z);
            treeVector.set(treex, treey, treez, treew).normalize();
            flowerOrientations.push(0, 0, 0, 0);
            flowerScale.push(25, 25, 25);
            var col = new THREE.Color(0xffffff);
            col.setHex( Math.random() * 0xffffff);
            FlowerColor.push(col.r, col.g, col.b);
            treeinstances += 1;
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

    CreateFlowerInstance(world, flowerOffsets, flowerOrientations, FlowerColor, flowerScale, treeinstances, Assets);    
    
    return geo;
}

function CreateFlowerInstance(world, offsets, orientations, colors, scale, instances, assets) {
    var bufferGeometry = assets['flower00'];//new THREE.BoxBufferGeometry( 2, 2, 2 );
    //console.log(instances);

    var geometry = new THREE.InstancedBufferGeometry();
			geometry.index = bufferGeometry.index;
			geometry.attributes.position = bufferGeometry.attributes.position;
            geometry.attributes.uv = bufferGeometry.attributes.uv;
            
    offsetAttribute = new THREE.InstancedBufferAttribute( new Float32Array( offsets ), 3 );
    orientationAttribute = new THREE.InstancedBufferAttribute( new Float32Array( orientations ), 4 );
    colorAttribute = new THREE.InstancedBufferAttribute( new Float32Array( colors ), 3 );

    geometry.addAttribute( 'offset', offsetAttribute );
    geometry.addAttribute( 'orientation', orientationAttribute );
    geometry.addAttribute( 'col', colorAttribute );

    var roll = randomRange(0, 10);
    var texture;

    if(roll > 5){
        texture = new THREE.TextureLoader().load( 'img/Game_File/flower_0.png');
    } else {
        texture =  new THREE.TextureLoader().load( 'img/Game_File/flower_1.png');
    }


    var material = new THREE.RawShaderMaterial( {
        uniforms: 
            THREE.UniformsUtils.merge([
            THREE.UniformsLib['fog'],
            {map: { value: texture}}]),
            
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        fog: true,
    } );

    mesh = new THREE.Mesh( geometry, material );

    material.uniforms.map.value = texture;

    mesh.frustumCulled = false;
    world.add(mesh);
}

function Tree(assets, world, x, y, z, instance, offsets, orientation) {

    ////pos = new THREE.Vector3(x, y + 1, z);
    ////var newTree = assets['tree00'].clone();
    ////newTree.position.set(pos.x, pos.y + newTree.scale.y/2.0, pos.z);
    ////
    ////world.add(newTree);
    ////newTree.traverse(function (child) {
    ////    if(child.isSprite){
    ////        SpriteManager.add(child);
    ////        child.position.set(pos.x, pos.y + newTree.scale.y, pos.z);
    ////        world.add(child);
    ////    }
    ////});
//
//
    //var vector = new THREE.Vector4();
    //var w = 1;
    //instance += 1;
    //vector.set(x, y, z, 0).normalize();
    //vector.multiplyScalar(115); // move out at least 5 units from center in current direction
    //offsets.push(x + vector.x, y + vector.y, z + vector.z);
    //vector.set(x, y, z, w).normalize();
    //orientation.push(vector.x, vector.y, vector.z, vector.w);
}

function Flower(assets, world, x, y, z, SpriteManager) {
    var scaleY = 25;

    var sprite;
    var roll = randomRange(0, 10);

    if (roll > 5) {
        sprite = assets['flower00'].clone();
    } else {
        sprite = assets['flower01'].clone();
    }

    SpriteManager.add(sprite);
    sprite.position.set(x, y + 1, z);
    world.add(sprite);
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


