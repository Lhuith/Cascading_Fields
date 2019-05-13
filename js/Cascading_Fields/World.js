const W_NUM_TILES = 3;
const W_TILE_SIZE = 255;
const TEXTURE_RESOLUTION = 256;
const TILE_GRID_SIZE = 16; //how many times is the tile chopped up into smaller bits
const WORLD = [];
const WORLD_OBJECT = new THREE.Object3D();
var SEED = 123;
const W_TILE_SCALE = 0.025;
const ANIM_WORLD_OBJECTS = new THREE.Object3D();
const SpriteSheetSize = new THREE.Vector2(8, 8);
const WORLD_TILE_SCALE = 1.0;


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

   var maps = MapGenerator(5, 1.9, 0.21, SEED, 1, new THREE.Vector2(0,0), TEXTURE_RESOLUTION);
 
   WORLD_OBJECT.add(CreateLandTile(0, 0, temp_data, temp_data[0].texture_data, temp_data[0].texture));
    //for (var x = 0; x < W_NUM_TILES; x++)
    //    for (var y = 0; y < W_NUM_TILES; y++) {
//
    //        
    //    }

    add_to_MainScene(WORLD_OBJECT);

    //console.log(WORLD_OBJECT);
    //CreateCreatures(temp_data[4].extra, temp_data[4].vert, temp_data[4].frag)
}

function CreateLandTile(worldx, worldy, temp_data, height, texture) {

    landMassChunk = new THREE.Object3D();

    var material = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib['lights'],
            THREE.UniformsLib['fog'],
            landUniform]),
        vertexShader: temp_data[2].vert,
        fragmentShader: temp_data[2].frag,
        lights: true,
        wireframe: true,
        fog: true
    });


    var chunkSize = (W_TILE_SIZE * W_TILE_SCALE);
    var detial = ((chunkSize / TILE_GRID_SIZE) / W_TILE_SCALE) * 4;

    var half_chunk = (chunkSize)/2;

    var full_size = (chunkSize - 1) * TILE_GRID_SIZE;

    //console.log(height);

    for (var y = 0; y < TILE_GRID_SIZE; y++)
        for (var x = 0; x < TILE_GRID_SIZE; x++) {

            var chunkgeo = GenerateTerrainMesh(
                height, 40, 1.0, detial, chunkSize / TILE_GRID_SIZE,
                ((x) * W_TILE_SIZE * W_TILE_SCALE) + half_chunk - full_size/2,
                ((y) * W_TILE_SIZE * W_TILE_SCALE) + half_chunk - full_size/2,
                chunkSize, TILE_GRID_SIZE, W_TILE_SCALE, x, y);

            var chunk = new THREE.Mesh(chunkgeo, material);

            chunk.castShadow = true; //default is false
            chunk.receiveShadow = true; //default
            chunk.scale.set(1, 1, 1);

            material.uniforms.texture.value = texture;
            //material.uniforms.extra.value = extraDetial;

            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.x = -1;
            texture.repeat.y = -1;
            texture.side = THREE.DoubleSide;

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


