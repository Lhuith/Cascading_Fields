function FetchCritter(hex, x, y, z, buffer, ray){
    var y;

    for(var i = 0; i < Critters.length; i++){
        if(hex == Critters[i].mapHexCode){
            y = GetCharHeight(ray, new THREE.Vector3(x, 0, z));
            PopulateBuffer(x, y, z, buffer, Critters[i]);
        }
    }
}

var Critters = [
    new Basic_Object 
    (
        "Crab",
        0xff7dff,
        [
            MapToSS(0, 0),
        ],
        new THREE.Vector3(25, 25, 25),
        new THREE.Vector2(3, 1),
        [
            new THREE.Color(0xff5a5b)
        ]
    ),
    new Basic_Object 
    (
        "Turtle",
        0x4b00ff,
        [
            MapToSS(0, 1),
        ],
        new THREE.Vector3(50, 50, 50),
        new THREE.Vector2(3, 1),
        [
            new THREE.Color(0x065122),
            new THREE.Color(0x0D7845),
            new THREE.Color(0x129858),
            new THREE.Color(0x16B460),
            new THREE.Color(0x0BD27D),
        ]
    )
];

function Basic_Object(name, maphex, ssIndex, size, animationFrames, colors){
    this.name = name;
    this.mapHexCode = maphex;
    this.size = size;
    this.ssIndex = ssIndex;
    this.animationFrames = animationFrames;
    this.colors = colors;
}

