const W_NUM_TILES = 4;
const W_TILE_SIZE = 512;
const TILE_CHUNKLETTES_SIZE = 16; //how many times is the tile chopped up into smaller bits
const WORLD = [];
const SEED = 13;
const W_TILE_SCALE = 50;



//Async loads anything that needs to be loaded
//_______         ________
//       \       /      //
//        \     /       //
//         \   /        //
//          \ /         //
//         y._.y        //
// Rescursive Async Call Function to save me all the headaches ever

function AsyncAntLionBootStrap(){

}


function World_init() {

    World_Generate();
}

function World_Generate() {

    //var grid_total_size = W_NUM_TILES * W_NUM_TILES;

    var h_map = MapGenerator(1, 1, 1, SEED, W_NUM_TILES, 0, W_TILE_SIZE);

    var chunkSize = (W_TILE_SIZE * W_TILE_SCALE);
    var detial = (chunkSize / TILE_CHUNKLETTES_SIZE) / W_TILE_SCALE;
    
    console.log(WORLD);

    for (var y = 0; y < W_NUM_TILES; y++)
        for (var x = 0; x < W_NUM_TILES; x++) {

            WORLD.push(
                GenerateTerrainMesh(
                    heightmap, (50.0 * W_TILE_SCALE), 
                    1.0, detial, chunkSize / TILE_CHUNKLETTES_SIZE, 
                    x, y,
                    W_TILE_SIZE * W_TILE_SCALE, 
                    TILE_CHUNKLETTES_SIZE, 
                    W_TILE_SCALE)
            )
        }

    console.log(WORLD);
    
}