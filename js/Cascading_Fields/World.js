const W_NUM_TILES = 5;
const W_TILE_SIZE = 255;
const TEXTURE_RESOLUTION = 256;
const TILE_GRID_SIZE = 16; //how many times is the tile chopped up into smaller bits
const WORLD_PHYSICAL = [];
const WORLD_OBJECT = new THREE.Object3D();
var SEED = 123;
const W_TILE_SCALE = 1.0;
const ANIM_WORLD_OBJECTS = new THREE.Object3D();
const SpriteSheetSize = new THREE.Vector2(8, 8);
const WORLD_TILE_SCALE = 1.0;

var volmetric_cube;


const mapindex =
        [2, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0];

function World_init(data) {

    //DirectionLightInit();

    World_Generate(data);
    add_to_MainScene(ANIM_WORLD_OBJECTS);
    //createClouds();
}

function World_Generate(temp_data) {
    var TreeBuffer = CreateBuffer();
    var EnviBuffer = CreateBuffer();
    var StructBuffer = CreateBuffer();
    var CreatureBuffer = CreateBuffer();
    //var grid_total_size = W_NUM_TILES * W_NUM_TILES;

    /*
    persistance = 2.9;//randomRange(0.65, 0.85);
    lacunarity = 0.21;//randomRange(1.9, 2.2);
    octaves = 5;//Math.round(randomRange(4, 6));
    noiseScale = 3;//randomRange(10, 200);
    */

    //var maps = MapGenerator(5, 1.9, 0.21, SEED, 1, new THREE.Vector2(0, 0), TEXTURE_RESOLUTION);
    
    var crab_isle_data = GetData("Crab_Isle");
    var water_tile_data = GetData("Water_Tile");

    var landShader = GetData("Land_Shader");
    var waterShader = GetData("Water_Shader");

    var crab_isle = CreateTile(landShader, crab_isle_data.height, 
        crab_isle_data.color, crab_isle_data.detail, crab_isle_data.detail_test, TILE_GRID_SIZE, W_TILE_SCALE, {tree: TreeBuffer, envi: EnviBuffer, strct: StructBuffer, crt: CreatureBuffer}, true, 0.0);

    var water_tile = CreateTile(waterShader, water_tile_data.height, 
        water_tile_data.color, crab_isle_data.detail, crab_isle_data.detail_test,  1, TILE_GRID_SIZE * W_TILE_SCALE, {}, false, 15.0);
    
    var chunkSize = (W_TILE_SIZE * W_TILE_SCALE);
    var full_size = (chunkSize) * TILE_GRID_SIZE;
    var full_world_size = ((chunkSize) * TILE_GRID_SIZE * W_NUM_TILES);

    for (var y = 0; y < W_NUM_TILES; y++) 
        for (var x = 0; x < W_NUM_TILES; x++){

            var world_pos_x = (x * full_size) + full_size / 2 - full_world_size / 2;
            var world_pos_y = (y * full_size) + full_size / 2 - full_world_size / 2;

            var index = mapindex[y * W_NUM_TILES + x];

            if (index == 1) {
                var newisle = crab_isle.clone();

                newisle.position.set(world_pos_x, 0, world_pos_y);
                WORLD_OBJECT.add(newisle);

                var water = water_tile.clone();
                water.position.set(world_pos_x, 0, world_pos_y );
                WORLD_OBJECT.add(water);
                
            } else if (index == 0) {
                var water = water_tile.clone();
               
                WORLD_OBJECT.add(water);
                ANIM_WORLD_OBJECTS.add(water);
                water.position.set(world_pos_x, 0, world_pos_y );
            }
        }
    
    //console.log(ANIM_WORLD_OBJECTS);

    add_to_MainScene(WORLD_OBJECT);

    //CreateCreatures("", "", "");
    var crab_shader = GetData("Instance_Shader");
    CreateInstance("Trees", WORLD_OBJECT, TreeBuffer, SpriteSheetSize, crab_shader, 0, false, true);
    CreateInstance("Structures", WORLD_OBJECT, StructBuffer, SpriteSheetSize, crab_shader, 1, false, true);
    CreateInstance("Creatures", WORLD_OBJECT, CreatureBuffer, SpriteSheetSize, crab_shader, 2, true, false);
}

function CreateTile(shader, height, color, detial_map, detial_test, gridSize, scale, buffers, physical, yoffset) {
    
    landMassChunk = new THREE.Object3D();
    
    var material = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib['lights'],
            THREE.UniformsLib['fog'],
            landUniform]),
        vertexShader: shader.vert,
        fragmentShader: shader.frag,
        lights: true,
        wireframe: shader.extra.wf,
        transparent: shader.extra.trans,
        fog: true
    });

    material.side = THREE.DoubleSide;
    var chunkSize = (W_TILE_SIZE * scale);
    var detial = ((chunkSize / gridSize) / scale) * 4;

    var half_chunk = (chunkSize) / 2;
    var full_size = (chunkSize) * gridSize;
    var world_mapping = half_chunk - (full_size - 1) / 2;

    detial_test.repeat.x = -1;
    detial_test.repeat.y = -1;

    detial_test.wrapS = THREE.RepeatWrapping;
    detial_test.wrapT = THREE.RepeatWrapping;


    color.wrapS = THREE.RepeatWrapping;
    color.wrapT = THREE.RepeatWrapping;


    material.uniforms.texture.value = color;
    material.uniforms.extra.value = detial_test;

    for (var y = 0; y < gridSize; y++)
        for (var x = 0; x < gridSize; x++) {

            var x_loc = ((x) * chunkSize) + world_mapping;
            var y_loc = ((y) * chunkSize) + world_mapping;

            var chunkgeo = GenerateTileMesh(
                height, detial_map, 1500, 1.0, detial, chunkSize / gridSize,
                x_loc,
                y_loc,
                chunkSize, gridSize, scale, x, y, buffers, yoffset);

            var chunk = new THREE.Mesh(chunkgeo, material);

            chunk.castShadow = true; //default is false
            chunk.receiveShadow = true; //default
            chunk.scale.set(1, 1, 1);
            landMassChunk.add(chunk);
            helper = new THREE.FaceNormalsHelper( chunk, 2, 0x00ff00, 12 );
            //WORLD_OBJECT.add(helper);    
                
            if(physical) {WORLD_PHYSICAL.push(chunk);}
        }     
    return landMassChunk;
}

function CreateCreatures(data, vert, frag) {

    var crab_shader = GetData("Instance_Shader");


    var CreatureBuffer = CreateBuffer();

    var raySampler = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0);

    for (var i = 0; i < 200; i++) {
        for (var j = 0; j < 200; j++) {
            
            FetchCritter(0xff7dff, (i - 200 / 2) * 32, -10, (j - 200 / 2) * 32, CreatureBuffer, raySampler);
        }
    }

    CreateInstance("Crotters", ANIM_WORLD_OBJECTS, CreatureBuffer, SpriteSheetSize, crab_shader, 2, true, false);
}

function createClouds(){
    var cloud_shader = GetData("Cloud_Shader");

    var CloudBuffer = CreateBuffer();

    var raySampler = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0);

    var size = 200;

    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            
            FetchElement(0xffffff, (i - size / 2) * 32, randomRange(200,350), (j - size / 2) * 32, CloudBuffer, raySampler);
        }
    }

    CreateInstance("Clouds", WORLD_OBJECT, CloudBuffer, SpriteSheetSize, cloud_shader, 3, false, false);
}




