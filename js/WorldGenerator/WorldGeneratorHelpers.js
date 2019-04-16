const ObjectScene = []; 

const FACEORIENTATIONS = [
    new THREE.Quaternion(0, 0, 0, 0),
    new THREE.Quaternion(0, 0.707, 0, 0.707),
    new THREE.Quaternion(0, 0.924, 0, 0.383),
    new THREE.Quaternion(0, 0.383, 0, 0.924)
]

const FACEORIENTATIONSIDENTITY = new THREE.Quaternion(0, 0, 0, 1);


function Basic_Object(name) {
    this.name = name;
    this.components = [];
    this.children = []
    this.parent;
    this.Object3D = new THREE.Object3D({name:name});
}

Basic_Object.prototype.setParent = function (p) {
    this.parent = p;
}

Basic_Object.prototype.addComponent = function (c) {
    this.components.push(c);
}

Basic_Object.prototype.addChild = function (c) {
    this.children.push(c);
}

function Renderer(ssIndex, size, animationFrames, colors, positionOffsets, orientation, type, parent) {
    this.size = size;
    this.ssIndex = ssIndex;
    this.animationFrames = animationFrames;
    this.colors = colors;
    this.posOffsets = positionOffsets;
    this.orientation = orientation;
    this.typeSwitch = type;
    this.parent = parent;
}

Basic_Object.prototype.Create3D = function (ssIndex, size, animationFrames, colors, positionOffsets) {

    //creates a 4 sided sphereical reprenstation of a 3d object?
    for (var i = 0; i < 4; i++) {
        var obj = new Basic_Object(this.name + i.toString());
        obj.setParent(this);
        obj.addComponent(new Renderer(ssIndex, size, animationFrames, colors, positionOffsets, FACEORIENTATIONS[i], 1, obj));
        this.children.push(obj);
    }
}

Basic_Object.prototype.CreateBox3D = function (ssIndex, size, animationFrames, colors, positionOffsets, W, H) {

    var obj = new Basic_Object(this.name + "Front");
    obj.setParent(this);
    obj.addComponent(
        new Renderer(ssIndex, size, animationFrames, colors, new THREE.Vector3(positionOffsets.x, positionOffsets.y, positionOffsets.z - H / 2),
            FACEORIENTATIONSIDENTITY, 1, obj));
    this.children.push(obj);

    var obj = new Basic_Object(this.name + "Back");
    obj.setParent(this);
    obj.addComponent(
        new Renderer(ssIndex, size, animationFrames, colors, new THREE.Vector3(positionOffsets.x, positionOffsets.y, positionOffsets.z + H / 2),
            FACEORIENTATIONSIDENTITY, 1, obj));
    this.children.push(obj);


    var obj = new Basic_Object(this.name + "Front");
    obj.setParent(this);
    obj.addComponent(
        new Renderer(ssIndex, size, animationFrames, colors, new THREE.Vector3(positionOffsets.x + W / 2, positionOffsets.y, positionOffsets.z),
            FACEORIENTATIONS[1], 1, obj));
    this.children.push(obj);

    var obj = new Basic_Object(this.name + "Back");
    obj.setParent(this);
    obj.addComponent(
        new Renderer(ssIndex, size, animationFrames, colors, new THREE.Vector3(positionOffsets.x - W / 2, positionOffsets.y, positionOffsets.z),
            FACEORIENTATIONS[1], 1, obj));
    this.children.push(obj);

}

Basic_Object.prototype.Render = function (x, y, z, buffer) {

    this.Object3D.position.set(x,y,z);

    if (this.components != undefined) {
        for (var i = 0; i < this.components.length; i++) {
            if (this.components[i] instanceof Renderer) {
                //PopulateBuffer(x, y, z, buffer);
                this.components[i].DecomposeAndRenderObject(this.Object3D.position.x, this.Object3D.position.y, this.Object3D.position.z, buffer);
            }
        }

    }
    if (this.children != undefined) {
        for (var j = 0; j < this.children.length; j++) {
            this.children[j].Render(this.Object3D.position.x, this.Object3D.position.y, this.Object3D.position.z, buffer);
        }
    }
}

Renderer.prototype.DecomposeAndRenderObject = function (x, y, z, buffer) {
    PopulateBuffer(x, y, z, buffer, this);
}
Renderer.prototype.setSize = function (s) {
    console.log(s);
    this.size = s;
}
function MapToSS(x, y) {
    return new THREE.Vector2((1 / 8) * x, (1 / 8) * y);
}