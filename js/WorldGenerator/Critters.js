function FetchCritter(hex, x, y, z, buffer, ray) {
    var y;

    for (var i = 0; i < Critters.length; i++) {
        if (hex == Critters[i].hex) {
            y = GetCharHeight(ray, new THREE.Vector3(x, 0, z));
            Critters[i].array.push(Crab.Render(x,y,z, buffer));

        }
    }
}

var Crab = new Basic_Object
    (
        "Crab",
    );

Crab.addComponent(
    new Renderer([
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

var Critters = [
    {hex: 0xff7dff, base: Crab, array: []},
];



