const W_NUM_TILES = 5;
const W_TILE_SIZE = 255;
const TEXTURE_RESOLUTION = 256;
const TILE_GRID_SIZE = 16; //how many times is the tile chopped up into smaller bits
const WORLD = [];
const WORLD_OBJECT = new THREE.Object3D();
var SEED = 123;
const W_TILE_SCALE = 2.5;
const ANIM_WORLD_OBJECTS = new THREE.Object3D();
const SpriteSheetSize = new THREE.Vector2(8, 8);
const WORLD_TILE_SCALE = 4.0;

const mapindex =
    [0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0];
//1048576 pixels for a 256 tile world
function World_init(data) {

    World_Generate(data);
    add_to_MainScene(ANIM_WORLD_OBJECTS);

}

function World_Generate(temp_data) {

    //var grid_total_size = W_NUM_TILES * W_NUM_TILES;

    /*
    persistance = 2.9;//randomRange(0.65, 0.85);
    lacunarity = 0.21;//randomRange(1.9, 2.2);
    octaves = 5;//Math.round(randomRange(4, 6));
    noiseScale = 3;//randomRange(10, 200);
    */

    //var maps = MapGenerator(5, 1.9, 0.21, SEED, 1, new THREE.Vector2(0, 0), TEXTURE_RESOLUTION);
    var crab_isle_height = GetData("World_Map_Crab_Isle");
    var crab_isle_color = GetData("World_Map_Crab_Isle_color");

    var water_tile_height = GetData("World_Water_Level");
    var water_tile_color = GetData("World_Map_Water");

    var crab_isle = CreateTile(temp_data, crab_isle_height.texture_data, crab_isle_color.texture, TILE_GRID_SIZE, W_TILE_SCALE, false);
    var water_tile = CreateTile(temp_data, water_tile_height.texture_data, water_tile_color.texture, 1, TILE_GRID_SIZE * W_TILE_SCALE, true);

    var chunkSize = (W_TILE_SIZE * W_TILE_SCALE);
    var full_size = (chunkSize) * TILE_GRID_SIZE;
    var full_world_size = ((chunkSize) * TILE_GRID_SIZE * W_NUM_TILES);

    for (var x = 0; x < W_NUM_TILES; x++)
        for (var y = 0; y < W_NUM_TILES; y++) {

            var world_pos_x = (x * full_size) + full_size / 2 - full_world_size / 2;
            var world_pos_y = (y * full_size) + full_size / 2 - full_world_size / 2;
            var newisle;

            var index = mapindex[y * 5 + x];
            console.log(index);
            if (index == 1) {
                newisle = crab_isle.clone();
                newisle.position.set(world_pos_x, 0, world_pos_y);

                var water = water_tile.clone();
                water.position.set(world_pos_x, 0, world_pos_y);

                WORLD_OBJECT.add(water);
            } else {
                newisle = water_tile.clone();
                newisle.position.set(world_pos_x, 0, world_pos_y);
            }

            WORLD_OBJECT.add(newisle);
        }

    add_to_MainScene(WORLD_OBJECT);
}

function CreateTile(temp_data, height, color, gridSize, scale, basic = false) {

    landMassChunk = new THREE.Object3D();
    var landShader = GetData("Land_Shader");

    var material = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib['lights'],
            THREE.UniformsLib['fog'],
            landUniform]),
        vertexShader: landShader.vert,
        fragmentShader: landShader.frag,
        lights: true,
        wireframe: false,
        fog: true
    });

    var chunkSize = (W_TILE_SIZE * scale);
    var detial = ((chunkSize / gridSize) / scale) * 4;

    var half_chunk = (chunkSize) / 2;
    var full_size = (chunkSize) * gridSize;
    var world_mapping = half_chunk - (full_size - 1) / 2;

    var chunkgeo;

    if (!basic) {
        for (var y = 0; y < gridSize; y++)
            for (var x = 0; x < gridSize; x++) {
                
                var x_loc = ((x) * chunkSize) + world_mapping;
                var y_loc = ((y) * chunkSize) + world_mapping;

                chunkgeo = GenerateTileMesh(
                    height, 180, 1.0, detial, chunkSize / gridSize,
                    x_loc,
                    y_loc,
                    chunkSize, gridSize, scale, x, y);

                var chunk = new THREE.Mesh(chunkgeo, material);

                chunk.castShadow = true; //default is false
                chunk.receiveShadow = true; //default
                chunk.scale.set(1, 1, 1);

                material.uniforms.texture.value = color;
                //material.uniforms.extra.value = extraDetial;

                color.wrapS = THREE.RepeatWrapping;
                color.wrapT = THREE.RepeatWrapping;
                color.repeat.x = -1;
                color.repeat.y = -1;
                color.side = THREE.DoubleSide;

                landMassChunk.add(chunk);
                //objects.push(plane);

            }
    } else {
        chunkgeo = GenerateTileMesh(
            height, 40, 1.0, detial, chunkSize / gridSize,
            world_mapping,
            world_mapping,
            chunkSize, .01, scale, 0, 0);

        var chunk = new THREE.Mesh(chunkgeo, material);

        chunk.castShadow = true; //default is false
        chunk.receiveShadow = true; //default
        chunk.scale.set(1, 1, 1);

        material.uniforms.texture.value = color;
        //material.uniforms.extra.value = extraDetial;

        color.wrapS = THREE.RepeatWrapping;
        color.wrapT = THREE.RepeatWrapping;
        color.repeat.x = -1;
        color.repeat.y = -1;
        color.side = THREE.DoubleSide;

        landMassChunk.add(chunk);
        //objects.push(plane);
    }



    return landMassChunk;
}

function CreateCreatures(data, vert, frag) {

    var ShaderInfo = { billvertex: vert, billfragment: frag };

    var CreatureBuffer = {
        offsets: [],
        orientations: [],
        vector: new THREE.Vector4(),
        scales: [],
        colors: [],
        uvoffsets: [],
        animationFrame: [],
        typeSwitch: [],
    }

    var raySampler = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0);

    for (var i = 0; i < data.amount; i++) {
        for (var j = 0; j < data.amount; j++) {
            FetchCritter(0xff7dff, (i - data.amount / 2) * 32, 1, (j - data.amount / 2) * 32, CreatureBuffer, raySampler);
        }
    }

    CreateInstance("Crotters", data.world, CreatureBuffer, SpriteSheetSize, ShaderInfo, 2, true, false);
}


