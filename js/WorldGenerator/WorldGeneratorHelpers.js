const FACEORIENTATIONS = [
    new THREE.Quaternion(0, 0, 0, 0),
    new THREE.Quaternion(0, 0.707, 0, 0.707),
    new THREE.Quaternion(0, 0.924, 0, 0.383),
    new THREE.Quaternion(0, 0.383, 0, 0.924)
]

const FACEORIENTATIONSIDENTITY = new THREE.Quaternion(0, 0, 0, 1);


function Basic_Object(name, maphex, solid = false) {
    this.name = name;
    this.mapHexCode = maphex;
    this.components = [];
    this.solid = solid;
    this.children = []
    this.parent;
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


function Renderer(ssIndex, size, animationFrames, colors, positionOffsets, orientation, parent) {
    this.size = size;
    this.ssIndex = ssIndex;
    this.animationFrames = animationFrames;
    this.colors = colors;
    this.posOffsets = positionOffsets;
    this.orientation = orientation;
    this.parent = parent;
}

Basic_Object.prototype.Create3D = function (ssIndex, size, animationFrames, colors, positionOffsets) {

    //creates a 4 sided sphereical reprenstation of a 3d object?
    for (var i = 0; i < 4; i++) {
        var obj = new Basic_Object(this.name + i.toString(), this.mapHexCode, false);
        obj.setParent(this);
        obj.addComponent(new Renderer(ssIndex, size, animationFrames, colors, positionOffsets, FACEORIENTATIONS[i], obj));
        this.children.push(obj);
    }
}

Basic_Object.prototype.CreateBox3D = function (ssIndex, size, animationFrames, colors, positionOffsets, W, H) {

    var obj = new Basic_Object(this.name + "Front", this.mapHexCode, false);
    obj.setParent(this);
    obj.addComponent(
        new Renderer(ssIndex, size, animationFrames, colors, new THREE.Vector3(positionOffsets.x, positionOffsets.y, positionOffsets.z  - H/2), 
        FACEORIENTATIONSIDENTITY, obj));
    this.children.push(obj);

    var obj = new Basic_Object(this.name + "Back", this.mapHexCode, false);
    obj.setParent(this);
    obj.addComponent(
        new Renderer(ssIndex, size, animationFrames, colors, new THREE.Vector3(positionOffsets.x, positionOffsets.y, positionOffsets.z + H/2), 
        FACEORIENTATIONSIDENTITY, obj));
    this.children.push(obj);


    var obj = new Basic_Object(this.name + "Front", this.mapHexCode, false);
    obj.setParent(this);
    obj.addComponent(
        new Renderer(ssIndex, size, animationFrames, colors, new THREE.Vector3(positionOffsets.x + W/2, positionOffsets.y, positionOffsets.z), 
        FACEORIENTATIONS[1], obj));
    this.children.push(obj);

    var obj = new Basic_Object(this.name + "Back", this.mapHexCode, false);
    obj.setParent(this);
    obj.addComponent(
        new Renderer(ssIndex, size, animationFrames, colors, new THREE.Vector3(positionOffsets.x - W/2, positionOffsets.y, positionOffsets.z), 
        FACEORIENTATIONS[1], obj));
    this.children.push(obj);

}

Basic_Object.prototype.Update = function (x, y, z, buffer) {

    if (this.components != undefined) {
        for (var i = 0; i < this.components.length; i++) {
            if (this.components[i] instanceof Renderer) {
                //PopulateBuffer(x, y, z, buffer);
                this.components[i].DecomposeObject(x, y, z, buffer);
            }
        }

    }
    if (this.children != undefined) {
        for (var j = 0; j < this.children.length; j++) {
            this.children[j].Update(x, y, z, buffer);
        }
    }
}

Renderer.prototype.DecomposeObject = function (x, y, z, buffer) {
    PopulateBuffer(x, y, z, buffer, this);
}