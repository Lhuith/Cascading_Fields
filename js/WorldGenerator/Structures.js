//function FetchStructure(hex, x, y, z, buffer, orientation, ray) {
//    var y;
//
//    for (var i = 0; i < Structure.length; i++) {
//        if (hex == Structure[i].hex) {
//            //facedata = GetCharHeightAndOrientation(ray, {x:x, y:y, z:z}, y);
//
//            Structure[i].base.Decompose(x, y, z, orientation, buffer);
//        }
//    }
//}
//
//
//var silver0 = 0xD3D3D3;
//var silver1 = 0x808080; 
//
////LampPost
//{
//var lampPost = 
//new Object_Frame
//    (
//    "LampPost",
//    FACEORIENTATIONSIDENTITY,
//    null
//
//);
//
//var lampPostBase =
//new Object_Frame
//(
//    "LampPostBase",
//    FACEORIENTATIONSIDENTITY,
//    lampPost
//);
//
//lampPostBase.CreateBox3D
//(
//    [MapToSS(0,0)], 
//    new THREE.Vector3(100,100,100), 
//    new THREE.Vector2(1,1), 
//    [new THREE.Color(silver0)], 
//    new THREE.Vector3(0,0,0));
//
//lampPost.addChild(lampPostBase);
//
//var lampPostHead =
//new Object_Frame
//(
//    "LampPostBase",
//    FACEORIENTATIONSIDENTITY,
//    lampPost
//
//);
//
//lampPostHead.CreateBox3D(
//    [MapToSS(1,0)], 
//    new THREE.Vector3(100, 100, 100), 
//    new THREE.Vector2(1,1), 
//    [new THREE.Color(silver1)], 
//    new THREE.Vector3(0, 70, 0),
//     16, 16)
//
//lampPost.addChild(lampPostHead);
////Strucutres are multiple instances of basic_object
//
//}
//
//var WallY = 
//    new Object_Frame
//        (
//        "wallY",
//        FACEORIENTATIONS[0],
//        null
//        );
//
//        WallY.addComponent(
//    new Decomposer([
//        MapToSS(1, 2),
//    ],
//        new THREE.Vector3(16, 16, 16),
//        new THREE.Vector2(3, 1),
//        [
//            new THREE.Color(0xff5a5b)
//        ],
//        new THREE.Vector3(0, 0, 0),
//        1,
//        WallY));
//
//var WallX = 
//new Object_Frame
//    (
//        "wallX",
//        FACEORIENTATIONS[1],
//        null
//    );
//    
//    WallX.addComponent(
//    new Decomposer([
//        MapToSS(1, 2),
//    ],
//        new THREE.Vector3(16, 16, 16),
//        new THREE.Vector2(3, 1),
//        [
//            new THREE.Color(0xff5a5b)
//        ],
//        new THREE.Vector3(0, 0, 0),
//        1,
//        WallX));
//
//var Structure = [
//    {hex:0xff9c00, base: lampPost},
//    {hex:0xffffff, base: WallY},
//    {hex:0x000000, base: WallX}
//];