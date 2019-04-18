function FetchEnviroment(hex, x, y, z, buffer, ray, chance) {
    var y;

    for (var i = 0; i < Enviroment.length; i++) {
        if (hex == Enviroment[i].mapHexCode && (randomRange(0, 10) < chance)) {

                y = GetCharHeight(ray, new THREE.Vector3(x, 0, z));
                PopulateBuffer(x, y, z, buffer, Enviroment[i]);
        }
    }
}

var Enviroment = [
    new Object_Frame
        (
            "flower",
            0x00ff00,
            [
                MapToSS(0, 6),
                MapToSS(1, 6),
                MapToSS(2, 6),
            ],
            new THREE.Vector3(50, 50, 50),
            new THREE.Vector2(1, 1),
            [
                new THREE.Color(0xFFDCD5),
                new THREE.Color(0xFFF0D5),
                new THREE.Color(0xEDCDFF),
                new THREE.Color(0xE0FFFD),
                new THREE.Color(0xFF5355),
                new THREE.Color(0x8EC2FE),
                new THREE.Color(0x8FFBFE),
                new THREE.Color(0xFFFF93),
            ],
            new THREE.Vector3(0,0,0),
            FACEORIENTATIONS[0],
        ),
    new Object_Frame
        (
            "mushy",
            0xff00ff,
            [
                MapToSS(3, 6),
                MapToSS(4, 6),
                MapToSS(5, 6),
                MapToSS(6, 6),
            ],
            new THREE.Vector3(50, 50, 50),
            new THREE.Vector2(1, 1),
            [
                new THREE.Color(0xF6F3EC),
                new THREE.Color(0xFB985F),
                new THREE.Color(0xDB4C2C),
                new THREE.Color(0xAA7B47),
                new THREE.Color(0xECDAC2),
            ],
            new THREE.Vector3(0,0,0),
            FACEORIENTATIONS[0],
        )
];