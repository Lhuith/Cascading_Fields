//function FetchCritter(hex, x, y, z, buffer, orientation, ray) {
//    var y;
//    //console.log(hex);
//    for (var i = 0; i < CrittersMeta.length; i++) {
//        if (hex == CrittersMeta[i].hex) {
//
//            CrittersMeta[i].base.Decompose(x, y, z, orientation, buffer);
//        }
//    }
//
//}
//
//var Turtle =
//    new Object_Frame
//        (
//            "Turtle",
//            FACEORIENTATIONS[0],
//            null
//        );
//
//Turtle.addComponent(
//    new Decomposer(
//        [
//            MapToSS(0, 0),
//        ],
//        new THREE.Vector3(15, 15, 15),
//        new THREE.Vector2(3, 1),
//        [
//            new THREE.Color(0x065122),
//            new THREE.Color(0x0D7845),
//            new THREE.Color(0x129858),
//            new THREE.Color(0x16B460),
//            new THREE.Color(0x0BD27D),
//        ],
//        new THREE.Vector3(0, 0, 0), 0, Turtle,
//    ));
//
//
//var Crab = new Object_Frame
//    (
//        "Crab",
//        FACEORIENTATIONS[0],
//        null
//    );
//
//Crab.addComponent(
//    new Decomposer([
//        MapToSS(0, 0),
//    ],
//        new THREE.Vector3(25, 25, 25),
//        new THREE.Vector2(3, 1),
//        [
//            new THREE.Color(0xff5a5b)
//        ],
//        new THREE.Vector3(0, 0, 0),
//        0,
//        Crab));
//
//var CrittersMeta = [
//    { hex: 0xff7dff, base: Crab },
//    { hex: 0x4b00ff, base: Turtle },
//];
//