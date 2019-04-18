function FetchCritter(hex, x, y, z, buffer, ray) {
    var y;

    for (var i = 0; i < CrittersMeta.length; i++) {
        if (hex == CrittersMeta[i].hex) {
            y = GetCharHeight(ray, new THREE.Vector3(x, 0, z));
            console.log("Zah?")
            CrittersMeta[i].base.Decompose(x,y,z,buffer);//PopulateBuffer(x, y, z, buffer, CrittersMeta[i]);
        }
    }
}

var Turtle =
    new Object_Frame
        (
            "Turtle",
        );

Turtle.addComponent(
    new Decomposer(
        [
            MapToSS(0, 0),
        ],
        new THREE.Vector3(50, 50, 50),
        new THREE.Vector2(3, 1),
        [
            new THREE.Color(0x065122),
            new THREE.Color(0x0D7845),
            new THREE.Color(0x129858),
            new THREE.Color(0x16B460),
            new THREE.Color(0x0BD27D),
        ],
        new THREE.Vector3(0, 0, 0),
        FACEORIENTATIONS[0], 0, Turtle,
    ));


var Crab = new Object_Frame
    (
        "Crab",
    );

Crab.addComponent(
    new Decomposer([
        MapToSS(0, 0),
    ],
        new THREE.Vector3(25, 25, 25),
        new THREE.Vector2(3, 1),
        [
            new THREE.Color(0xff5a5b)
        ],
        new THREE.Vector3(0, 0, 0),
        FACEORIENTATIONS[0],
        0,
        Crab));

var CrittersMeta = [
    { hex: 0xff7dff, base: Crab },
    { hex: 0x4b00ff, base: Turtle },
];
