//function FetchElement(hex, x, y, z, buffer, ray){
//    var y;
//
//    for (var i = 0; i < ElementsMeta.length; i++) {
//        if (hex == ElementsMeta[i].hex) {
//            face = GetCharHeightAndOrientation(ray, new THREE.Vector3(x, 0, z), 1);
//            //console.log("Zah?")
//            ElementsMeta[i].base.Decompose(x, y, z, facedata.axis, facedata.radians, buffer);
//        }
//    }
//}
//
//
//var Cloud = new Object_Frame
//    (
//        "Cloud",
//        FACEORIENTATIONS[0],
//        null
//    );
//
//Cloud.addComponent(
//    new Decomposer([
//        MapToSS(0, 1),
//    ],
//        new THREE.Vector3(200, 200, 200),
//        new THREE.Vector2(3, 1),
//        [
//            new THREE.Color(0xe5e5e5)
//        ],
//        new THREE.Vector3(0, 0, 0),
//        0,
//        Cloud));
//
//var ElementsMeta = [
//{ hex: 0xffffff, base: Cloud },
//];