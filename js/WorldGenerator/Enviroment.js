function FetchEnviroment(hex, x, y, z, buffer, ray) {
    var y;

    for (var i = 0; i < Enviroment.length; i++) {
        if (hex == Enviroment[i].mapHexCode) {

            if (randomRange(0, 100) > 99.1) {
                y = GetCharHeight(ray, new THREE.Vector3(x, 0, z));
                PopulateBuffer(x, y, z, buffer, Enviroment[i]);
            }
        }
    }
}

var Enviroment = [
    new Basic_Object
        (
            "flower_meduim",
            0x00ff00,
            MapToSS(0, 6),
            new THREE.Vector3(25, 25, 25),
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
            ]
        ),
    new Basic_Object
        (
            "mushy_meduim",
            0xff00ff,
            MapToSS(3, 6),
            new THREE.Vector3(25, 25, 25),
            new THREE.Vector2(1, 1),
            [
                new THREE.Color(0xF6F3EC),
                new THREE.Color(0xFB985F),
                new THREE.Color(0xDB4C2C),
                new THREE.Color(0xAA7B47),
                new THREE.Color(0xECDAC2),
            ]
        )
];

function Basic_Object(name, maphex, ssIndex, size, animationFrames, colors) {
    this.name = name;
    this.mapHexCode = maphex;
    this.size = size;
    this.ssIndex = ssIndex;
    this.animationFrames = animationFrames;
    this.colors = colors;
}
