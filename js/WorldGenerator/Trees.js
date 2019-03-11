function FetchTrees(hex, x, y, z, buffer, enviBuffer, ray, world){
    var facedata;

    for(var i = 0; i < Trees.length; i++){
        if(hex == Trees[i].obj.mapHexCode){
            //console.log("Found Tree");
            facedata = GetCharHeightAndOrientation(ray, new THREE.Vector3(x, 0, z));
            PopulateGenericForestBuffers(x, facedata.y, z, buffer, enviBuffer, facedata, Trees[i], world)
        }
    }
}

var Trees = [
    new Tree_Object 
    (
        new Basic_Object(
        "PineWood",
        0x9f9f9f,
        MapToSS(0, 1), //index of 1
        new THREE.Vector3(200, 200, 200),
        new THREE.Vector2(0, 0),
        [
            new THREE.Color(0xAE875E),
        ]
        ),
        new Tree_Extra(
            true,
            0.5,
            2.0,
            MapToSS(1, 0),
            [
                new THREE.Color(0xB0C658),
                new THREE.Color(0x4FB64F),
                new THREE.Color(0x9ADA7D),
                new THREE.Color(0x197F54),
                new THREE.Color(0xBEE7AC),
            ],
            2
        )
    ),
    new Tree_Object 
    (
        new Basic_Object(
        "Mushroom",
        0x9600ff,
        MapToSS(0, 7), //index of 1
        new THREE.Vector3(200, 200, 200),
        new THREE.Vector2(0, 0),
        [
            new THREE.Color(0xF6F3EC),
            new THREE.Color(0xFB985F),
            new THREE.Color(0xDB4C2C),
            new THREE.Color(0xAA7B47),
            new THREE.Color(0xECDAC2),
        ]
        ),
        new Tree_Extra(
            false,
            2.0,
            0.0,
            new Vector2(0, 0),
            [
            ],
            3
        )
    ),
    new Tree_Object 
    (
        new Basic_Object(
        "Basic",
        0x009600,
        MapToSS(0, 4), //index of 1
        new THREE.Vector3(200, 200, 200),
        new THREE.Vector2(0, 0),
        [
            new THREE.Color(0xAE875E),
        ]
        ),
        new Tree_Extra(
            true,
            0.5,
            1.5,
            MapToSS(4, 0),
            [
                new THREE.Color(0xB0C658),
                new THREE.Color(0x4FB64F),
                new THREE.Color(0x9ADA7D),
                new THREE.Color(0x197F54),
                new THREE.Color(0xBEE7AC),
            ],
            1.5
        )
    ),
    new Tree_Object 
    (
        new Basic_Object(
        "Burnt",
        0x4b0000,
        MapToSS(0, 3), //index of 1
        new THREE.Vector3(200, 200, 200),
        new THREE.Vector2(0, 0),
        [
            new THREE.Color(0x010103),
            new THREE.Color(0x3A3839),
            new THREE.Color(0x9B9AA1),
            new THREE.Color(0x3C3E46),
            new THREE.Color(0xB6B9C1),
        ]
        ),
        new Tree_Extra(
            false,
            1.0,
            1.5,
            MapToSS(0, 3),
            [
            ],
            1.5
        )
    ),
    new Tree_Object 
    (
        new Basic_Object(
        "Stump",
        0x4b004b,
        MapToSS(0, 5), //index of 1
        new THREE.Vector3(200, 200, 200),
        new THREE.Vector2(0, 0),
        [

            new THREE.Color(0x010103),
            new THREE.Color(0x3A3839),
            new THREE.Color(0x9B9AA1),
            new THREE.Color(0x3C3E46),
            new THREE.Color(0xB6B9C1),
        ]
        ),
        new Tree_Extra(
            false,
            1.5,
            1.5,
            MapToSS(0, 5),
            [
            ],
            1
        )
    ),
    new Tree_Object 
    (
        new Basic_Object(
        "Willow",
        0x00d9ff,
        MapToSS(0, 2), //index of 1
        new THREE.Vector3(400, 400, 400),
        new THREE.Vector2(0, 0),
        [
            new THREE.Color(0xAE875E),
        ]
        ),
        new Tree_Extra(
            true,
            1.5,
            1.5,
            new Vector2((1/8) * 2, 0),
            [
                new THREE.Color(0xB0C658),
                new THREE.Color(0x4FB64F),
                new THREE.Color(0x9ADA7D),
                new THREE.Color(0x197F54),
                new THREE.Color(0xBEE7AC),
                
            ],
            1
        )
    ),
    //new Tree_Object 
    //(
    //    new Basic_Object(
    //    "Bush",
    //    0x4b9600,
    //    new THREE.Vector2(0, (1/8) * 6), //index of 1
    //    new THREE.Vector3(100, 100, 100),
    //    new THREE.Vector2(0, 0),
    //    [
    //        new THREE.Color(0xAE875E),
    //    ]
    //    ),
    //    new Tree_Extra(
    //        true,
    //        1.1,
    //        1.2,
    //        new Vector2((1/8) * 6, 0),
    //        [
    //            new THREE.Color(0xB0C658),
    //            new THREE.Color(0x4FB64F),
    //            new THREE.Color(0x9ADA7D),
    //            new THREE.Color(0x197F54),
    //            new THREE.Color(0xBEE7AC),
    //            
    //        ],
    //        2
    //    )
    //),
    new Tree_Object 
    (
        new Basic_Object(
        "Magic",
        0x0096ff,
        MapToSS(0, 0), //index of 1
        new THREE.Vector3(200, 200, 200),
        new THREE.Vector2(0, 0),
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
        new Tree_Extra(
            true,
            1.1,
            1.4,
            new Vector2((1/8) * 0, 0),
            [
                new THREE.Color(0x13918F),
                new THREE.Color(0x7BB16B),
                new THREE.Color(0xB7B270),
                new THREE.Color(0xBB6C60),
                new THREE.Color(0xB05C7D),
                
            ],
            2
        )
    ),
];

function Tree_Object(obj, extra){
    this.obj = obj;
    this.extra = extra;

    //|     | leaves 
    //|     | branches scale/2
    //|     | trunk scale/2
    //|     | roots scale/2
    //trunkHightAdjust = trunkHightAdjust/32;

  
}

function Tree_Extra(hasLeaves = true, trunkHeightScale = 1.0, leavesMult = 1.0, leavesUvIndex, leafColors, randomTrunkRange = 1.0){
    this.hasLeaves = hasLeaves;
    this.trunkHeightScale = trunkHeightScale;
    this.leavesMultiplier = leavesMult;
    this.leaveUvIndex = leavesUvIndex;
    this.leafColors = leafColors;
    this.randomTrunkRange = randomTrunkRange;
}

function PopulateGenericForestBuffers(x, y, z, buffer, EnivormentalBuffer, rotInfo, tree_object, worldObject) {
    
    var hexInfo = tree_object.obj.colors[randomRangeRound(0, tree_object.obj.colors.length - 1)];

    var mx = new THREE.Matrix4().makeRotationAxis(rotInfo.axis, rotInfo.radians);
    var faceQ = new THREE.Quaternion().setFromRotationMatrix(mx);

    var trunkHeight = tree_object.extra.trunkHeightScale * randomRange(1.0, tree_object.extra.randomTrunkRange);
   

    var half = tree_object.obj.size.y/2.0;
    var pixelSize = (tree_object.obj.size.y / 32);
    var rootSpriteDiffrence = ((tree_object.obj.size.y) - (pixelSize * 3)) / 2.0;

    var rootsPos = half;

    var rootSpriteDiffrence = ((tree_object.obj.size.y) - (pixelSize * 3)) / 2.0;//has to be hardcoded for now :(

    var trunkPos = Math.abs(((rootsPos + half) - rootSpriteDiffrence) - (half * trunkHeight));

    var branchesPos = trunkPos + (half) + ((tree_object.obj.size.y * trunkHeight) / 2.0);

    offsets = {
        root: half,
        trunk: trunkPos,
        branch: branchesPos,
    }

    var FaceOrientations = [
        new THREE.Quaternion(0, 0, 0, 0),
        new THREE.Quaternion(0, 0.707, 0, 0.707),
        new THREE.Quaternion(0, 0.924, 0, 0.383),
        new THREE.Quaternion(0, 0.383, 0, 0.924)
    ]

    for(var i = 0; i < FaceOrientations.length; i++){
    CreateGenericTreeFace(x, y, z, buffer,
        FaceOrientations[i], faceQ,
        tree_object.obj.size, tree_object.obj.ssIndex, hexInfo, offsets, trunkHeight);
    }

    if (tree_object.extra.hasLeaves) {
        var yPos = (y + branchesPos);
        var leavesMult = tree_object.extra.leavesMultiplier;

        var newSize =  new THREE.Vector3(tree_object.obj.size.x * leavesMult,
            tree_object.obj.size.y * leavesMult, tree_object.obj.size.z * leavesMult);
        var leafcol = tree_object.extra.leafColors[randomRangeRound(0, tree_object.extra.leafColors.length - 1)];
        //console.log(leafcol);
        PushToEnviromentBuffers(x, yPos + (rootsPos * (tree_object.extra.leavesMultiplier - 1)), z, EnivormentalBuffer, 
        tree_object.extra.leaveUvIndex, newSize, leafcol);
    }


    var geometry = new THREE.BoxGeometry(25, tree_object.obj.size.y, 25);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    //scene.add( cube );
    cube.visible = false;
    cube.position.set(x, y, z);

    //boxHelper = new THREE.BoxHelper(cube);
    //boxHelper.material.color.set(0xffffff);
    //world.add(boxHelper);
    worldObject.add(cube);
    //collision.push()
}

function CreateGenericTreeFace(x, y, z, buffer, orientation,
    faceQuaternion, scale, uvIndex, col, offsetInfo, trunkH) {
        //console.log(offsetInfo);
    var combined = new THREE.Quaternion(orientation.x, orientation.y, orientation.z, orientation.w).multiply(faceQuaternion);

    buffer.scales.push(scale.x, scale.y, scale.z);
    buffer.vector.set(x, y, z, 0).normalize();

    buffer.offsets.push(x + buffer.vector.x, y + buffer.vector.y + offsetInfo.root, z + buffer.vector.z);
    buffer.vector.set(x, y, z, w).normalize();
    buffer.orientations.push(orientation.x, orientation.y, orientation.z, orientation.w);


    buffer.uvoffsets.push(uvIndex.x, uvIndex.y); //Select sprite at 0, 0 on grid
    buffer.colors.push(col.r, col.g, col.b);
    buffer.animationFrame.push(0, 0);
    //----------------------------TRUNK-------------------------------------------

    var yScale = scale.y * trunkH;

    buffer.scales.push(scale.x, yScale, scale.z);

    buffer.vector.set(x, y, z, 0).normalize();
    buffer.offsets.push(x + buffer.vector.x, y + buffer.vector.y + offsetInfo.trunk, z + buffer.vector.z);
    buffer.vector.set(x, y, z, w).normalize();
    buffer.orientations.push(orientation.x, orientation.y, orientation.z, orientation.w);


    buffer.uvoffsets.push(uvIndex.x + (1/8 * 1), uvIndex.y); //Select sprite at 1, 1 on grid

    buffer.colors.push(col.r, col.g, col.b);
    buffer.animationFrame.push(0, 0);
    //----------------------------TRUNK-------------------------------------------

    //----------------------------Branches-------------------------------------------
    buffer.scales.push(scale.x, scale.y, scale.z);
    buffer.vector.set(x, y, z, 0).normalize();
    buffer.offsets.push(x + buffer.vector.x, y + buffer.vector.y + offsetInfo.branch, z + buffer.vector.z);
    buffer.vector.set(x, y, z, w).normalize();
    buffer.orientations.push(orientation.x, orientation.y, orientation.z, orientation.w);

    buffer.uvoffsets.push(uvIndex.x * 0 + (1/8 * 2), uvIndex.y); //Select sprite at 1, 1 on grid

    buffer.colors.push(col.r, col.g, col.b);
    buffer.animationFrame.push(0, 0);
    //----------------------------Branches-------------------------------------------
}