//Main Game File, All things will be controlled from this location

const World_QuadTree = new Quad_Tree(new Rectangle(0, 0, textureSize, textureSize), 25);
var crabdata;
var Pstart;
var GAME_TIME = 0;

//Initiaizling anything that needs data loaded in
function LoadResources(){
    for(var i = 0; i < MapFileurl.length; i++){
        var texture = new THREE.TextureLoader().load(MapFileurl[i]);
        MapFileIndex.push(texture);
    }
}

function cascading_fields_init(camera, mainscene){
    GAME_TIME = 0;

    CreateBounds(mainscene);
    MovementInit(camera, textureSize, mapScale);
    CreatePlayerCollider(mainscene);
    SetUpSunAndMoon();
    Console_Init();

    Pstart = new THREE.Vector3().copy(controls.getObject().position);
    
}

//call functions who need things loaded in, like json files, shaders and textures
function cascding_fields_loaded(data) {
    //console.log(data);

    LoadResources();
    setUpSky(true, data[3].vert, data[3].frag);
    //setUpLand(true, data[2].vert, data[2].frag);

    World_init(data);
}

function cascading_fields_update(delta) {
    GAME_TIME += delta;
    Input_Init();

    Get_Console_Input();
    Console_Ouput();
    Movement(delta);
    AnimateClouds(delta);
    DayNightCycle(delta);

    HandleCollisions();
    shader_update();
    //WORLD_OBJECT.position.x = Math.sin(GAME_TIME) * 50;
}


function shader_update(){
    
    if (skyMaterial !== undefined) {
        skyMaterial.uniforms.time.value = GAME_TIME;
    }

    if (ANIM_WORLD_OBJECTS.children.length != 0) {


        for (var i = 0; i < ANIM_WORLD_OBJECTS.children.length; i++) {
            if (ANIM_WORLD_OBJECTS.children[i] != undefined) {
                ANIM_WORLD_OBJECTS.children[i].material.uniforms.time.value = GAME_TIME;
            }
        }
    }
}

function Reset_Player() {
    controls.getObject().position.set(Pstart.x, Pstart.y, Pstart.z);
}

function LateUpdate() {

}

