function FetchStructure(hex, x, y, z, buffer, ray) {
    var y;

    for (var i = 0; i < Structure.length; i++) {
        if (hex == Structure[i].hex) {
            y = GetCharHeight(ray, new THREE.Vector3(x, 0, z));

            //console.log(Structure[i].components[0]);
            Structure[i].array.push(lampPost.Decompose(x,y,z, buffer));
        }
    }
}


var silver0 = 0xD3D3D3;
var silver1 = 0x808080; 

//LampPost
{
var lampPost = 
new Object_Frame
    (
    "LampPost",

);

var lampPostBase =
new Object_Frame
(
"LampPostBase",
0xff9c00,
);

lampPostBase.Create3D
(
    [MapToSS(0,0)], 
    new THREE.Vector3(100,100,100), 
    new THREE.Vector2(1,1), 
    [new THREE.Color(silver0)], 
    new THREE.Vector3(0,0,0));

lampPost.addChild(lampPostBase);

var lampPostHead =
new Object_Frame
(
"LampPostBase",
0xff9c00,
);

lampPostHead.CreateBox3D(
    [MapToSS(1,0)], 
    new THREE.Vector3(100, 100, 100), 
    new THREE.Vector2(1,1), 
    [new THREE.Color(silver1)], 
    new THREE.Vector3(0, 70, 0),
     16, 16)

lampPost.addChild(lampPostHead);
//Strucutres are multiple instances of basic_object
}

var Structure = [
    {hex:0xff9c00, base: lampPost, array: []}
];