const FACEORIENTATIONS = [
    new THREE.Quaternion(0, 0, 0, 0),
    new THREE.Quaternion(0, 0.707, 0, 0.707),
    new THREE.Quaternion(0, 0.924, 0, 0.383),
    new THREE.Quaternion(0, 0.383, 0, 0.924)
]

const FACEORIENTATIONSIDENTITY = new THREE.Quaternion(0, 0, 0, 1);


function Basic_Object(name, maphex, solid = false){
    this.name = name;
    this.mapHexCode = maphex;
    this.components = [];
    this.solid = solid;
    this.children = []
}

Basic_Object.prototype.addComponent = function(c){
    this.components.push(c);
}

Basic_Object.prototype.addChild = function(c){
    this.children.push(c);
}


function Renderer(ssIndex, size, animationFrames, colors, positionOffsets, orientation){
    this.size = size;
    this.ssIndex = ssIndex;
    this.animationFrames = animationFrames;
    this.colors = colors;
    this.posOffsets = positionOffsets;
    this.orientation = orientation;
}

function Create3DObjectArray(name, maphex, ssIndex, size, animationFrames, colors, positionOffsets, orientationOffset, solid = false, children){
    var array = [4];

    for(var i = 0; i < FACEORIENTATIONS.length; i++){
        array[i] = new Basic_Object(
            name, 
            maphex, 
            ssIndex, 
            size, 
            animationFrames, 
            colors, 
            positionOffsets, 
            FACEORIENTATIONS[i].multiply(orientationOffset),
            solid,
            children
        );
    }

    return array;
}

Renderer.prototype.DecomposeObject = function(x, y, z, buffer) {
    PopulateBuffer(x, y, z, buffer, this);
}