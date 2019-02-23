
function GenerateTerrainMesh(heightMap, heightMultiplier, _heightCurve, levelOfDetial, size, world) {

    var bufferGeometry = new THREE.BufferGeometry();

    var width = size;
    var height = size;

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
    var hPoint = 0;
    var hPoint1 = 0;
    var offsetTest = 0;

    for (iy = 0; iy < gridY1; iy++) {

        var y = iy * segment_height - height_half;

        var y1 = (iy + 1) * segment_height - height_half;

        for (ix = 0; ix < gridX1; ix++) {

            var x = ix * segment_width - width_half;

            var x1 = (ix + 1) * segment_width - width_half;
            

            //Current Hpoint
            var index = ((iy * widthSegments + ix));
            hPoint = heightMap[index];
            var finalP = EasingFunctions.easeInQuint(hPoint) * heightMultiplier;

            //Next HPoint
            var index1 = (((iy + 1) * widthSegments + (ix + 1)));
            hPoint1 = heightMap[index1];

            var finalP1 = EasingFunctions.easeInQuint(hPoint1) * heightMultiplier;

            var vector = new THREE.Vector3(x, finalP, y);
            var vector1 = new THREE.Vector3(x1, finalP1, y1);

            var midVector = new THREE.Vector3(
            (vector1.x - vector.x) / 2 + vector.x,
            (vector1.y - vector.y) / 2 + vector.y,
            (vector1.z - vector.z) / 2 + vector.z)
            
            vertices.push(vector.x, vector.y, vector.z);
            //(2nd - 1st) / 2 + 1st)
            var cross = new THREE.Vector3(vector1.x, vector1.y, vector1.z).cross(vector).normalize();

            normals.push(cross.x, cross.y, cross.z);

            uvs.push((ix / gridX));
            uvs.push((iy / gridY));

            if (hPoint > .3 && hPoint < .65) {
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
                    Tree(world, tree00, midVector.x, midVector.y , midVector.z, cross);
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


