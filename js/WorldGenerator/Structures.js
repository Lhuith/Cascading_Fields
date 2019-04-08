function FetchStructure(hex, x, y, z, buffer, ray) {
    var y;

    for (var i = 0; i < Structure.length; i++) {
        if (hex == Structure[i].mapHexCode) {
            y = GetCharHeight(ray, new THREE.Vector3(x, 0, z));
            Structure[i].DecomposeObject(x, y, z, buffer);
        }
    }
}


var silver0 = 0xD3D3D3;
var silver1 = 0x808080;

//Strucutres are multiple instances of basic_object
var Structure = [
    new Basic_Object
        (
            "LampPost",
            0xff9c00,
            [
                MapToSS(0, 0),
            ],
            new THREE.Vector3(100, 100, 100),
            new THREE.Vector2(3, 1),
            [
                new THREE.Color(silver0)
            ],
            new THREE.Vector3(0, 0, 0),
            FACEORIENTATIONS[0],
            true,
            [
                new Basic_Object
                    (
                        "LampPostBaseMain",
                        0xff9c00,
                        [
                            MapToSS(0, 0),
                        ],
                        new THREE.Vector3(100, 100, 100),
                        new THREE.Vector2(3, 1),
                        [
                            new THREE.Color(silver1)
                        ],
                        new THREE.Vector3(0, 0, 0),
                        FACEORIENTATIONS[0],
                        true,
                        Create3DObjectArray(
                            "LampPostBaseSegment",
                            0xff9c00,
                            [
                                MapToSS(0, 0),
                            ],
                            new THREE.Vector3(100, 100, 100),
                            new THREE.Vector2(3, 1),
                            [
                                new THREE.Color(silver1)
                            ],
                            new THREE.Vector3(0, 0, 0),
                            FACEORIENTATIONSIDENTITY,
                            true,
                        )
                    ),
                    new Basic_Object
                    (
                        "LampPostHead",
                        0xff9c00,
                        [
                            MapToSS(1, 0),
                        ],
                        new THREE.Vector3(100, 100, 100),
                        new THREE.Vector2(3, 1),
                        [
                            new THREE.Color(silver0)
                        ],
                        new THREE.Vector3(0, 72, 8),
                        FACEORIENTATIONS[0],
                        true,
                        [
                            new Basic_Object
                            (
                                "LampPostHeadBack",
                                0xff9c00,
                                [
                                    MapToSS(1, 0),
                                ],
                                new THREE.Vector3(100, 100, 100),
                                new THREE.Vector2(3, 1),
                                [
                                    new THREE.Color(silver0)
                                ],
                                new THREE.Vector3(0, 72, -8),
                                FACEORIENTATIONS[0],
                                true,
                            ),
                            new Basic_Object
                            (
                                "LampPostHeadLeft",
                                0xff9c00,
                                [
                                    MapToSS(1, 0),
                                ],
                                new THREE.Vector3(100, 100, 100),
                                new THREE.Vector2(3, 1),
                                [
                                    new THREE.Color(silver0)
                                ],
                                new THREE.Vector3(-8, 72, 0),
                                FACEORIENTATIONS[1],
                                true,
                            ),
                            new Basic_Object
                            (
                                "LampPostHeadLeft",
                                0xff9c00,
                                [
                                    MapToSS(1, 0),
                                ],
                                new THREE.Vector3(100, 100, 100),
                                new THREE.Vector2(3, 1),
                                [
                                    new THREE.Color(silver0)
                                ],
                                new THREE.Vector3(8, 72, 0),
                                FACEORIENTATIONS[1],
                                true,
                            )
                        ]
                    )
            ]
        ),
];



