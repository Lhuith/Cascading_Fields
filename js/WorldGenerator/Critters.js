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
        ],
        new THREE.Vector3(0,0,0),
        FACEORIENTATIONS[0],
    ),
];



