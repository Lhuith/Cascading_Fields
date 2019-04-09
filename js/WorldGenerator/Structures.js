function FetchStructure(hex, x, y, z, buffer, ray) {
    var y;

    for (var i = 0; i < Structure.length; i++) {
        if (hex == Structure[i].mapHexCode) {
            y = GetCharHeight(ray, new THREE.Vector3(x, 0, z));

            //console.log(Structure[i].components[0]);
            Structure[i].components[0].DecomposeObject(x, y, z, buffer);
        }
    }
}


var silver0 = 0xD3D3D3;
var silver1 = 0x808080; 

var lampPost = 
new Basic_Object
    (
    "LampPost",
    0xff9c00,
    true,
);

var lampPostBase =
new Basic_Object
(
"LampPostBase",
0xff9c00,
true,
);

lampPost.addChild(lampPostBase);


/*
    new Renderer(
    [MapToSS(0, 0)],
    new THREE.Vector3(100, 100, 100),
    new THREE.Vector2(1,1),
    [
        new THREE.Color(silver0)
    ],
    new THREE.Vector3(0,0,0),
    FACEORIENTATIONSIDENTITY
))
*/

//Strucutres are multiple instances of basic_object
var Structure = [
    lampPost,
];
