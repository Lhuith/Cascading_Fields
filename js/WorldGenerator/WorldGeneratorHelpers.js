const ObjectScene = []; 

const FACEORIENTATIONS = [
    new THREE.Euler(0, 0, 0,  'XYZ'),
    new THREE.Euler(0, 1.5708, 0,  'XYZ'),
    new THREE.Euler(0, 0, 0,  'XYZ'),
    new THREE.Euler(0, 0, 0,  'XYZ')
]

const FACEORIENTATIONSIDENTITY = new THREE.Euler(0, 0, 0,  'XYZ');

const MapFileurl =[
    'img/Game_File/trees.png',
    'img/Game_File/structures.png',
    'img/Game_File/critters.png',
    'img/Game_File/element.png',
];
const MapFileIndex =[];

function DebugCube(x, y, z, col){
    
    var geometry = new THREE.BoxGeometry( 3, 3, 3 );
    var material = new THREE.MeshBasicMaterial( {color: col} );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.set(x, y, z);

    add_to_MainScene( cube );
}

function CreateBuffer(){
    return {
        offsets: [],
        orientations: [],
        vector: new THREE.Vector4(),
        scales: [],
        colors: [],
        uvoffsets: [],
        animationFrame: [],
        typeSwitch: [],
        normals: []
    };
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

function Frame_Transform(position, orientation, scale){
    this.position = position;
    this.orientation = orientation;
    this.scale = scale;

    this.parent_matrix = new THREE.Matrix4().identity();
    this.parent_transform;
}

Frame_Transform.prototype.getTransformation = function(){
   var translation = new THREE.Matrix4().makeTranslation(this.position.x, this.position.y, this.position.z);
   var rotation = new THREE.Matrix4().makeRotationFromQuaternion(this.orientation);
   var scale = new THREE.Matrix4().makeScale(this.scale.x, this.scale.y, this.scale.z);
   
   console.log(this.parent_matrix);

   return this.parent_matrix.multiply(translation.multiply(rotation.multiply(scale)));
}

Frame_Transform.prototype.setParentTransform = function(p){
    this.parent_transform = p.transform;
}

Frame_Transform.prototype.setParentMatrix = function(p){
    //console.log(p.transform.getTransformation());
    this.parent_matrix = p.transform.getTransformation();
}

Frame_Transform.prototype.getTransformedPosition = function(){
    var point = this.position.applyMatrix4(this.parent_matrix);

    //console.log(this.position);
    //console.log(point);

    return point;   
}

Frame_Transform.prototype.getScale = function(){
    return (this.parent != null) ? new Vector3(1,1,1) : this.parent.transform.scale ;
}

// ------------------------------- OBJECT FRAME --------------------------------- \\
function Object_Frame(name, euler_rot, position, scale, parent = null) {
    this.name = name;
    this.components = [];
    this.children = []
    this.parent = parent;

    this.transform = new Frame_Transform
    (
        new THREE.Vector3(position.x, position.y, position.z), 
        new THREE.Quaternion().setFromEuler(euler_rot), 
        new THREE.Vector3(scale.x, scale.y, scale.z)
    );
}

Object_Frame.prototype.setOrientation = function(o){this.transform.orientation =  new THREE.Quaternion().setFromEuler(o).clone();}

Object_Frame.prototype.addToOrientation = function(q){
    var newRot = this.transform.orientation.multiply(q).clone();
    this.transform.orientation = newRot.normalize();
}

Object_Frame.prototype.setPosition = function(x,y,z){this.transform.position = new THREE.Vector3(x,y,z);}
Object_Frame.prototype.setParent = function (p) { this.parent = p;}
Object_Frame.prototype.addComponent = function (c) { this.components.push(c);}

Object_Frame.prototype.addChild = function (c) { 
    c.transform.setParentMatrix(this);
    c.transform.setParentTransform(this);
    this.children.push(c);
}

Object_Frame.prototype.Create3D = function (ssIndex, size, animationFrames, colors, positionOffsets) {

    //creates a 4 sided reprenstation of a 3d object
    for (var i = 0; i < 4; i++) {
        var obj = new Object_Frame(this.name + " side " + i.toString(), 
        FACEORIENTATIONS[i], new THREE.Vector3(0,0,0), new THREE.Vector3(1,1,1), this);

        obj.addComponent(new Decomposer(ssIndex, size, animationFrames, colors, positionOffsets, 1, obj));
        this.addChild(obj);
    }
}

Object_Frame.prototype.CreateBox3D = function (ssIndex, size, animationFrames, colors, positionOffsets, W, H) {

    var obj = new Object_Frame(this.name + "Front", 
    FACEORIENTATIONSIDENTITY, new THREE.Vector3(0,0,0), new THREE.Vector3(1,1,1), this);
    
    obj.addComponent(
        new Decomposer(ssIndex, size, animationFrames, colors, new THREE.Vector3(positionOffsets.x, positionOffsets.y, positionOffsets.z - H / 2), 1, obj));
    this.addChild(obj);

    var obj = new Object_Frame(this.name + "Back", 
    FACEORIENTATIONSIDENTITY, new THREE.Vector3(0,0,0), new THREE.Vector3(1,1,1), this);

    obj.addComponent(
        new Decomposer(ssIndex, size, animationFrames, colors, 
            new THREE.Vector3(positionOffsets.x, positionOffsets.y, positionOffsets.z + H / 2), 1, obj));
    this.addChild(obj);

    var obj = new Object_Frame(this.name + "Front", 
    FACEORIENTATIONS[1], new THREE.Vector3(0,0,0), new THREE.Vector3(1,1,1), this);

    obj.addComponent(
        new Decomposer(ssIndex, size, animationFrames, colors, new THREE.Vector3(positionOffsets.x + W / 2, positionOffsets.y, positionOffsets.z), 1, obj));
    this.addChild(obj);

    var obj = new Object_Frame(this.name + "Back", 
    FACEORIENTATIONS[1], new THREE.Vector3(0,0,0), new THREE.Vector3(1,1,1), this);

    obj.addComponent(
        new Decomposer(ssIndex, size, animationFrames, colors, new THREE.Vector3(positionOffsets.x - W / 2, positionOffsets.y, positionOffsets.z), 1, obj));
    this.addChild(obj);
}

Object_Frame.prototype.Decompose = function (x, y, z, orientation, buffer, isChild) {

    if(isChild){
        //console.log(this.name + " is child of " + this.parent.name);
    } else {
        //console.log("is parent " + this.name);
    }

    if (this.components != undefined) {
        for (var i = 0; i < this.components.length; i++) {
            if (this.components[i] instanceof Decomposer) {
                //----------------------- This Decompose ------------------------- //
                PopulateBuffer(this.transform.getTransformedPosition(),
                    this.transform.orientation, this.transform.scale, buffer, this.components[i]);
            }
        }
    }
    
    if (this.children != undefined) {
        for (var j = 0; j < this.children.length; j++) {
            this.children[j].Decompose(x, y, z, orientation, buffer, true);
        }
    }
}
// ------------------------------- OBJECT FRAME --------------------------------- \\

function Decomposer(ssIndex, size, animationFrames, colors, positionOffsets, type, parent) {
    this.size = size;
    this.ssIndex = ssIndex;
    this.animationFrames = animationFrames;
    this.colors = colors;
    this.posOffsets = positionOffsets;
    this.typeSwitch = type;
    this.parent = parent;
}

function MapToSS(x, y) {
    return new THREE.Vector2((1 / 8) * x, (1 / 8) * y);
}