const FACEORIENTATIONS = [
    new THREE.Quaternion(0, 0, 0, 0),
    new THREE.Quaternion(0, 0.707, 0, 0.707),
    new THREE.Quaternion(0, 0.924, 0, 0.383),
    new THREE.Quaternion(0, 0.383, 0, 0.924)
]

const FACEORIENTATIONSIDENTITY = new THREE.Quaternion(0, 0, 0, 1);


function Basic_Object(name, maphex, ssIndex, size, animationFrames, colors, positionOffsets, orientation, solid = false, children){
    this.name = name;
    this.mapHexCode = maphex;
    this.size = size;
    this.ssIndex = ssIndex;
    this.animationFrames = animationFrames;
    this.colors = colors;
    this.posOffsets = positionOffsets;
    this.orientation = orientation;
    this.solid = solid;

    if(children != undefined)
        this.children = children;
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

Basic_Object.prototype.DecomposeObject = function(x, y, z, buffer) {

    //Pass 1 for primary
    PopulateBuffer(x, y, z, buffer, this);
   
    //Pass 2 for primary's children
    if (this.children != undefined ) {
        for (var i = 0; i < this.children.length; i++) {
            //PopulateBuffer(x, y, z, buffer, Structure[i].children[j]);
            this.children[i].DecomposeObject(x, y, z, buffer);
        }
    }
}