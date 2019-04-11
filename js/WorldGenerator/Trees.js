function FetchTrees(hex, x, y, z, buffer, enviBuffer, ray, world) {
    var facedata;

    for (var i = 0; i < Trees.length; i++) {
        if (hex == Trees[i].mapHexCode) {
            console.log("Found Tree");
            facedata = GetCharHeightAndOrientation(ray, new THREE.Vector3(x, 0, z));
            //PopulateGenericForestBuffers(x, facedata.y, z, buffer, enviBuffer, facedata, Trees[i], world)
            Trees[i].Update(x, facedata.y, z, buffer);
            //console.log(Trees[i]);

        }
    }
}

PineWood = CreateTree("PineWood", 0x9f9f9f,  new THREE.Vector2(0, 1), new THREE.Vector3(200, 200, 200), new THREE.Color(0x3C2E27));

function CreateTree(name, hex, ssindex, size, trunkcolor, leavescolor) {

    var new_tree =
        new Basic_Object(
            name,
            hex,
        );


    var new_tree_base =
        new Basic_Object(
            name + "Base",
            hex,
        );
    

    //Rotation TODO:

    //var mx = new THREE.Matrix4().makeRotationAxis(rotInfo.axis, rotInfo.radians);
    //var faceQ = new THREE.Quaternion().setFromRotationMatrix(mx);

    //Rotation TODO:
    
    var trunkHeight = 1.0;//tree_object.extra.trunkHeightScale * randomRange(1.0, tree_object.extra.randomTrunkRange);


    var half = size.y / 2.0;
    var pixelSize = (size.y / 32);
    var rootSpriteDiffrence = ((size.y) - (pixelSize * 3)) / 2.0;
    var rootsPos = half;
    var rootSpriteDiffrence = ((size.y) - (pixelSize * 3)) / 2.0;//has to be hardcoded for now :(

    var trunkPos = Math.abs(((rootsPos + half) - rootSpriteDiffrence) - (half * trunkHeight));
    var branchesPos = trunkPos + (half) + ((size.y * trunkHeight) / 2.0);

    //Roots ------------------------------------------------------------------------------
    new_tree_base.Create3D(
        [
            MapToSS(ssindex.x, ssindex.y), //index of 1
        ],
        size,
        new THREE.Vector2(1, 1),
        [
            trunkcolor
        ],
        new THREE.Vector3(0, 0, 0)
    );
    //Roots ------------------------------------------------------------------------------

    //Trunk ------------------------------------------------------------------------------
    new_tree_base.Create3D(
        [
            MapToSS(ssindex.x + 1, ssindex.y), //index of 1
        ],
        size,
        new THREE.Vector2(1, 1),
        [
            trunkcolor
        ],
        new THREE.Vector3(0, trunkPos, 0)
    );
    //Trunk ------------------------------------------------------------------------------

    //Branches ---------------------------------------------------------------------------
    new_tree_base.Create3D(
        [
            MapToSS(ssindex.x + 2, ssindex.y), //index of 1
        ],
        size,
        new THREE.Vector2(1, 1),
        [
            trunkcolor 
        ],
        new THREE.Vector3(0, branchesPos, 0)
    );
    //Branches ---------------------------------------------------------------------------

    var new_tree_leaves =
    new Basic_Object(
        name + "_leaves",
        hex,
    );
    
    //new_tree_leaves.addComponent

    new_tree.addChild(new_tree_base);

    return new_tree;
}

var Trees = [
    PineWood,
];

function Tree_Object(obj, extra) {
    this.obj = obj;
    this.extra = extra;

    //|     | leaves 
    //|     | branches scale/2
    //|     | trunk scale/2
    //|     | roots scale/2
    //trunkHightAdjust = trunkHightAdjust/32;


}

function Tree_Extra(hasLeaves = true, trunkHeightScale = 1.0, leavesMult = 1.0, leavesUvIndex, leafColors, randomTrunkRange = 1.0) {
    this.hasLeaves = hasLeaves;
    this.trunkHeightScale = trunkHeightScale;
    this.leavesMultiplier = leavesMult;
    this.leaveUvIndex = leavesUvIndex;
    this.leafColors = leafColors;
    this.randomTrunkRange = randomTrunkRange;
}

function PopulateGenericForestBuffers(x, y, z, buffer, EnivormentalBuffer, rotInfo, tree_object, worldObject) {

    //var hexInfo = tree_object.obj.colors[randomRangeRound(0, tree_object.obj.colors.length - 1)];


    offsets = {
        root: half,
        trunk: trunkPos,
        branch: branchesPos,
    }
    var uvs = tree_object.obj.ssIndex[randomRangeRound(0, tree_object.obj.ssIndex.length - 1)];

    for (var i = 0; i < FACEORIENTATIONS.length; i++) {
        CreateGenericTreeFace(x, y, z, buffer,
            FACEORIENTATIONS[i], faceQ,
            tree_object.obj.size, uvs, hexInfo, offsets, trunkHeight);
    }

    if (tree_object.extra.hasLeaves) {
        var uvs = tree_object.extra.leaveUvIndex[randomRangeRound(0, tree_object.extra.leaveUvIndex.length - 1)];
        var yPos = (y + branchesPos);
        var leavesMult = tree_object.extra.leavesMultiplier;

        var newSize = new THREE.Vector3(tree_object.obj.size.x * leavesMult,
            tree_object.obj.size.y * leavesMult, tree_object.obj.size.z * leavesMult);
        var leafcol = tree_object.extra.leafColors[randomRangeRound(0, tree_object.extra.leafColors.length - 1)];
        //console.log(leafcol);
        PushToEnviromentBuffers(x, yPos + (rootsPos * (tree_object.extra.leavesMultiplier - 1)), z, EnivormentalBuffer,
            uvs, newSize, leafcol);
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
