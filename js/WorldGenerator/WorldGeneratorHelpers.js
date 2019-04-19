const ObjectScene = []; 

const FACEORIENTATIONS = [
    new THREE.Quaternion(0, 0, 0, 0),
    new THREE.Quaternion(0, 0.707, 0, 0.707),
    new THREE.Quaternion(0, 0.924, 0, 0.383),
    new THREE.Quaternion(0, 0.383, 0, 0.924)
]

const FACEORIENTATIONSIDENTITY = new THREE.Quaternion(0, 0, 0, 1);


function Object_Frame(name) {
    this.name = name;
    this.components = [];
    this.children = []
    this.parent;
}


//Object_Frame.prototype.setPosition = function(v){
//    this.Physical.position.copy(v); 
//}

function LoadResources(){
    for(var i = 0; i < MapFileurl.length; i++){
        var texture = new THREE.TextureLoader().load(MapFileurl[i]);
        MapFileIndex.push(texture);
    }
}

function ObjectSoup(name, offsets, scales, orientation, color, length){
    this.name = name;
    this.offsets = offsets;
    this.scales = scales;
    this.orientation = orientation;
    this.color = color;
    this.length = length;
}

const Soups = [];

Object_Frame.prototype.setParent = function (p) {
    this.parent = p;
}

Object_Frame.prototype.addComponent = function (c) {
    this.components.push(c);
}

Object_Frame.prototype.addChild = function (c) {
    this.children.push(c);
}

function Decomposer(ssIndex, size, animationFrames, colors, positionOffsets, orientation, type, parent) {
    this.size = size;
    this.ssIndex = ssIndex;
    this.animationFrames = animationFrames;
    this.colors = colors;
    this.posOffsets = positionOffsets;
    this.orientation = orientation;
    this.typeSwitch = type;
    this.parent = parent;
}

Object_Frame.prototype.Create3D = function (ssIndex, size, animationFrames, colors, positionOffsets) {

    //creates a 4 sided sphereical reprenstation of a 3d object?
    for (var i = 0; i < 4; i++) {
        var obj = new Object_Frame(this.name + i.toString());
        obj.setParent(this);
        obj.addComponent(new Decomposer(ssIndex, size, animationFrames, colors, positionOffsets, FACEORIENTATIONS[i],1, obj));
        this.children.push(obj);
    }
}

Object_Frame.prototype.CreateBox3D = function (ssIndex, size, animationFrames, colors, positionOffsets, W, H) {

    var obj = new Object_Frame(this.name + "Front");
    obj.setParent(this);
    obj.addComponent(
        new Decomposer(ssIndex, size, animationFrames, colors, new THREE.Vector3(positionOffsets.x, positionOffsets.y, positionOffsets.z - H / 2),
            FACEORIENTATIONSIDENTITY, 1, obj));
    this.children.push(obj);

    var obj = new Object_Frame(this.name + "Back");
    obj.setParent(this);
    obj.addComponent(
        new Decomposer(ssIndex, size, animationFrames, colors, new THREE.Vector3(positionOffsets.x, positionOffsets.y, positionOffsets.z + H / 2),
            FACEORIENTATIONSIDENTITY, 1, obj));
    this.children.push(obj);


    var obj = new Object_Frame(this.name + "Front");
    obj.setParent(this);
    obj.addComponent(
        new Decomposer(ssIndex, size, animationFrames, colors, new THREE.Vector3(positionOffsets.x + W / 2, positionOffsets.y, positionOffsets.z),
            FACEORIENTATIONS[1], 1, obj));
    this.children.push(obj);

    var obj = new Object_Frame(this.name + "Back");
    obj.setParent(this);
    obj.addComponent(
        new Decomposer(ssIndex, size, animationFrames, colors, new THREE.Vector3(positionOffsets.x - W / 2, positionOffsets.y, positionOffsets.z),
            FACEORIENTATIONS[1], 1, obj));
    this.children.push(obj);

}

Object_Frame.prototype.Decompose = function (x, y, z, buffer) {

    if (this.components != undefined) {
        for (var i = 0; i < this.components.length; i++) {
            if (this.components[i] instanceof Decomposer) {
                //PopulateBuffer(x, y, z, buffer);
                this.components[i].DecomposeAndRenderObject(x, y, z, buffer);
            }
        }
    }
    if (this.children != undefined) {
        for (var j = 0; j < this.children.length; j++) {
            this.children[j].Decompose(x, y, z);
        }
    }
}

Decomposer.prototype.DecomposeAndRenderObject = function (x, y, z, buffer) {
    PopulateBuffer(x, y, z, buffer, this);
}
Decomposer.prototype.setSize = function (s) {
    console.log(s);
    this.size = s;
}
function MapToSS(x, y) {
    return new THREE.Vector2((1 / 8) * x, (1 / 8) * y);
}