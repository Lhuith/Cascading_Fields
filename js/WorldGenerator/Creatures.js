function FetchCreature(hex, x, y, z, buffer, ray){
    var y;

    for(var i = 0; i < Creatures.length; i++){
        if(hex == Creatures[i].mapHexCode){
            y = GetCharHeight(ray, new THREE.Vector3(x, 0, z));
            PopulateBuffer(x, y, z, buffer, Creatures[i]);
        }
    }
}

var Creatures = [
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
    ),
];

function Basic_Object(name, maphex, ssIndex, size, animationFrames, colors){
    this.name = name;
    this.mapHexCode = maphex;
    this.size = size;
    this.ssIndex = ssIndex;
    this.animationFrames = animationFrames;
    this.colors = colors;
}