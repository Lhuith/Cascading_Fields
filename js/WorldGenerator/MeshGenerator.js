
function GenerateTerrainMesh(heightMap, heightMultiplier, _heightCurve, levelOfDetial, ChunkSize, Worldx, Worldy, world, mapsize, gridsize, scale) {

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

    var flower00 = new THREE.TextureLoader().load("img/Game_File/flower_00.png");
    flower00.magFilter = THREE.NearestFilter;
    flower00.minFilter = THREE.NearestFilter;

    var flower01 = new THREE.TextureLoader().load("img/Game_File/flower_01.png");
    flower01.magFilter = THREE.NearestFilter;
    flower01.minFilter = THREE.NearestFilter;

    var tree00 = new THREE.TextureLoader().load("img/Game_File/tree_Trunk_00.png");
    tree00.magFilter = THREE.NearestFilter;
    tree00.minFilter = THREE.NearestFilter;

    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            //console.log(heightMap[i][j]);
        }
    }
    //console.log("Poop", gridX1);
    //console.log("ChunkSize",ChunkSize);

    var hPoint = 0;
    var hPoint1 = 0;
    //65536

    //console.log( mapsize);
    for (iy = 0; iy < gridY1; iy++) {

        var worldCoordY = (Worldy * (ChunkSize) - mapsize/scale);

        var y = (iy * (segment_height) - height_half) + worldCoordY;

        var y1 = ((iy + 1) * (segment_height) - height_half) + worldCoordY;

        for (ix = 0; ix < gridX1; ix++) {

            var worldCoordX = (Worldx * (ChunkSize) - mapsize/scale);

            var x = (ix * (segment_width) - width_half) + worldCoordX;

            var x1 = ((ix + 1) * (segment_width) - width_half) + worldCoordX;
            
            //65536
            //proper section sampling
            //(iy * (mapsize - 1) + ix)

            //256 <---- mapsize
            //64 <---- mapsize / 4 <-- gridsize = 4
            //64 <------ ChunkSize mapsize/gridsize

            //4 x 4 chunks
            //256 x 256 
            //256 is 1 side length
            
            //gridsmaple ChunkSize should be (256/no. of grids/scale)

            //heightMap.length  = 65536 = 256x256
            //4x4 = 16
            //map ChunkSize / grid ChunkSize = 1 chunk sample ChunkSize

            //32 is per chunk, 32*4

            var GridSampleSize = ((mapsize)/(gridsize));
            //GridSampleSize = 64
            //iy needs to take 64 + steps per chunk iterration

            var worldGridX = ((Worldx + 1) * GridSampleSize) - GridSampleSize;
            var worldGridY = ((Worldy + 1) * GridSampleSize) - GridSampleSize;

            var yMapIndex = (iy + worldGridY);
            var xMapIndex = (ix + worldGridX);

            var index = (yMapIndex * (mapsize) + xMapIndex); 
            
            //console.log(iy + worldGridY);

            hPoint = heightMap[(index)];

            var finalP = EasingFunctions.easeInQuint(hPoint) * heightMultiplier;

            //Next HPoint
            var index1 = index;// ((iy + Worldy) * sampleSize + (ix + Worldx));
            hPoint1 = heightMap[index1];

            console.log(xMapIndex);
            var finalP1 = EasingFunctions.easeInQuint(hPoint1) * heightMultiplier;

            var vector = new THREE.Vector3(x, finalP, y);
            var vector1 = new THREE.Vector3(x1, finalP1, y1);

            var midVector = new THREE.Vector3(
            ((vector1.x - vector.x) / 2) + vector.x,
            ((vector1.y - vector.y) / 2) + vector.y,
            ((vector1.z - vector.z) / 2) + vector.z)
            
            vertices.push(vector.x, vector.y, vector.z);
            //(2nd - 1st) / 2 + 1st)
            var cross = new THREE.Vector3(vector1.x, vector1.y, vector1.z).cross(vector).normalize();

            normals.push(0.0, 1.0, 0.0);
            
            //console.log( ( (ix/width_half) + (Worldx) ) / gridsize);

            
            var uvX = (ix/ChunkSize)/(gridsize/scale);
            var uvY = (iy/ChunkSize)/(gridsize/scale);
            
            var worldUVX = (Worldx/ (gridsize));
            var worldUVY = (Worldy/ (gridsize));

            uvs.push((uvX + worldUVX) );
            uvs.push((uvY + worldUVY) );

           // console.log(worldUVX);

            if (hPoint > .2 && hPoint < .65) {
                var roll = randomRange(0, 10);

               // if (roll > 9)
                   // Flower(world, flower00, x - (segment_width / 2.0), finalP, y - (segment_height / 2.0));

                var roll = randomRange(0, 10);

                //if (roll > 8)
                    //Flower(world, flower01, x - (segment_width / 2.0), finalP, y - (segment_height / 2.0));
            }

            if ((iy * widthSegments + ix) % 12 == 0) {

                //Vegetation
                if (hPoint >= .5 && hPoint <= .55) {
                    //Tree(world, tree00, midVector.x, midVector.y , midVector.z, cross);
                }
            }

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
    //build geometry

    bufferGeometry.setIndex(indices);
    bufferGeometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    bufferGeometry.addAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    bufferGeometry.addAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

    var geo = new THREE.Geometry().fromBufferGeometry(bufferGeometry);

    geo.mergeVertices();
    geo.computeFaceNormals();
    geo.computeVertexNormals();

    return geo;
}

function Tree(world, texture, x, y, z, cross) {

    var scaleY = 100;
    var trunkGeo = new THREE.Geometry();
    var material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    var trunk = new THREE.Mesh(trunkGeo, material);
    var pos = new THREE.Vector3(x, y , z);
    trunk.position.set(pos.x, pos.y, pos.z);
    //cross.setLength(14);
    for (var i = 0; i < 3; i++) {
        var material = new THREE.MeshBasicMaterial({map: texture, color: 0xffffff });
        var geometry = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material);
        material.alphaTest = 0.5;
        material.transparent = false;
        geometry.rotation.y = (Math.PI / 3) * i;
        //geometry.scale.set(25, 50, 25)
        material.side = THREE.DoubleSide;
        geometry.position.set(0, 0.5, 0);
        trunk.add(geometry);
    }

    //LEAVES---------------------------------------------------
    var leaves = new THREE.TextureLoader().load("img/Game_File/Tree_Leaves_00.png");
    leaves.magFilter = THREE.NearestFilter;
    leaves.minFilter = THREE.NearestFilter;
    var spriteMaterial = new THREE.SpriteMaterial({ map: leaves, color: Math.random() * 0x5cdf49 });

    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(125, scaleY, 100)
   
    sprite.position.set(pos.x, pos.y + scaleY, pos.z);
    sprite.visible = false;
    //trunk.add(sprite);
    //LEAVES---------------------------------------------------
    trunk.add(sprite);
    world.add(sprite);

    material.side = THREE.DoubleSide;

    trunk.scale.set(50, scaleY, 50);
    trunk.rotation.y = (randomRange(0,Math.PI));
    trunk.visible = false;
    trunk.lookAt(cross);
    //var box = new THREE.BoxHelper( trunk, 0xffff00 );
    world.add(trunk);
}

function Flower(world, texture, x, y, z) {
    var scaleY = 25;

    var spriteMaterial = new THREE.SpriteMaterial({ map: texture, color: Math.random() * 0xffffff });
    var sprite = new THREE.Sprite(spriteMaterial);
    //scene.add( sprite );
    sprite.scale.set(25, 25, 25)
    sprite.position.set(x + (randomRange(-125,125)), y + scaleY/2.0, z + (randomRange(-125,125)))
    sprite.visible = false;
    world.add(sprite);
}
/*
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 * source : https://gist.github.com/gre/1650294
 */
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


