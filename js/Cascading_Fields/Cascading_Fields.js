//Main Game File, All things will be controlled from this location

const World_QuadTree = new Quad_Tree(new Rectangle(0, 0, textureSize, textureSize), 25);
var crabdata;
var Pstart;
var GAME_TIME = 0;
var SunLight;
var MoonLight;
//var dirLight;

var x;
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
    DayNightCycle(25);
}

//call functions who need things loaded in, like json files, shaders and textures
function cascding_fields_loaded(data) {
 
    LoadResources();
    var sky = GetData("Sky_Shader");
    setUpSky(true, sky.vert,sky.frag);

    World_init(data);

 
}

function cascading_fields_update(delta, camera) {
    GAME_TIME += delta;
    Input_Init();

    Get_Console_Input();
    Console_Ouput();
    Movement(delta);
   // AnimateClouds(delta);
    //DayNightCycle(delta);
    //HandleCollisions();
    shader_update();
}


function shader_update(){
    //console.log(ANIM_WORLD_OBJECTS);
    
    if (skyMaterial !== undefined) {
        skyMaterial.uniforms.time.value = GAME_TIME;
    }

    if (ANIM_WORLD_OBJECTS.children.length != 0) {
        for (var i = 0; i < ANIM_WORLD_OBJECTS.children.length; i++) {
            if (ANIM_WORLD_OBJECTS.children[i] != undefined) {

                if(ANIM_WORLD_OBJECTS.children[i].material != undefined){
                    ANIM_WORLD_OBJECTS.children[i].material.uniforms.time.value = GAME_TIME;
                }

                if(ANIM_WORLD_OBJECTS.children[i].children != undefined){
                    for (var j = 0; j < ANIM_WORLD_OBJECTS.children[i].children.length; j++) {
                        
                        if(ANIM_WORLD_OBJECTS.children[i].children[j].material != undefined){
                            ANIM_WORLD_OBJECTS.children[i].children[j].material.uniforms.time.value = GAME_TIME;
                        }
                    }
                }
            }
        }
    }
}

function Reset_Player() {
    controls.getObject().position.set(Pstart.x, Pstart.y, Pstart.z);
}

function LateUpdate() {

}

function DirectionLightInit() {
    SunLight = GetData("Sun").light;//new THREE.DirectionalLight(0xffffff, 0.8);
    //var vector = new THREE.Vector3(0, 1500, 0);
    //console.log(SunLight);

    //dirLight.shadow.camera.near = 0.01;
    //dirLight.castShadow = true;
//
    //var d = 550;
//
    //dirLight.shadow.camera.left = -d;
    //dirLight.shadow.camera.right = d;
    //dirLight.shadow.camera.top = d;
    //dirLight.shadow.camera.bottom = -d;
//
    //dirLight.shadow.mapSize.width = 512;
    //dirLight.shadow.mapSize.height = 512;
//
    //dirLight.shadow.camera.far = 2500;
    //dirLight.shadow.bias = -0.01;


    //SunLight.position.set(vector.x, vector.y, vector.z);
    //SunLight.add( SunLight.target );

    //var targetObject = new THREE.Object3D();
    //targetObject.position.set(0,0,0);
    //add_to_MainScene(targetObject);
    //SunLight.target = targetObject;


    //var helper = new THREE.DirectionalLightHelper(SunLight, 1115 );

    add_to_MainScene(SunLight);
    //(SunLight);
}



