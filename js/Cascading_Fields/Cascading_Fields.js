//Main Game File, All things will be controlled from this location

const World_QuadTree = new Quad_Tree(new Rectangle(0,0, textureSize, textureSize), 25);
var crabdata;

var Pstart;


function init_cascding_fields(){

    Pstart = new THREE.Vector3().copy(controls.getObject().position);

    Input_Init();
    LoadResources();
    Console_Init();
    World_init();
    CreatePlayerCollider(MainScene);
    CreateBounds(MainScene);
}


function update_cascading_fields(){
    Get_Console_Input();
    Console_Ouput();
}


function Reset_Player(){
    controls.getObject().position.set(Pstart.x, Pstart.y, Pstart.z);
}

function LateUpdate(){

}

