function FetchElement(hex, x, y, z, buffer, ray, chance){
    var y;

    for(var i = 0; i < Element.length; i++){
        if(hex == Element[i].mapHexCode && (randomRange(0, 10) <= chance)){
            y = GetCharHeight(ray, new THREE.Vector3(x, 0, z));
            PopulateBuffer(x, y, z, buffer, Element[i]);
        }
    }
}

var Element = [
    new Basic_Object 
    (
        "Fire",
        0x838383,
        [
            MapToSS(0, 0),
        ],
        new THREE.Vector3(75, 75, 75),
        new THREE.Vector2(7, 7),
        [
            new THREE.Color(0xF9B11F),
        ],
        new THREE.Vector3(75, 75, 75),
        FACEORIENTATIONS[0],
    ),
];
