//Main Game File, All things will be controlled from this location

const World_QuadTree = new Quad_Tree(new Rectangle(0,0, textureSize, textureSize), 25);

function init_cascding_fields(){
    //Init All Game Stuff here
    //World_QuadTree = ;
    var obj = new THREE.Object3D();
    obj.position.set(1,1,1);

    console.log(World_QuadTree);
    World_QuadTree.Insert(obj);
    console.log(World_QuadTree);
}

function Update(){

}

function LateUpdate(){

}