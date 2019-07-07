function FetchTrees(hex, x, y, z, buffer, orientation, ray, scale) {
    var facedata;

    for (var i = 0; i < TreesMeta.length; i++) {

        if (hex == TreesMeta[i].hex) {
            var s_v = TreesMeta[i].meta.size.clone();

            var tree = CreateTree(
                TreesMeta[i].meta.name, 
                TreesMeta[i].meta.ss, 
                new THREE.Vector3(x, y, z),
                orientation,
                new THREE.Vector3(s_v.x * scale, s_v.y * scale, s_v.z * scale), 
                randomRange(TreesMeta[i].meta.t_range.x, TreesMeta[i].meta.t_range.y), 
                TreesMeta[i].meta.color, TreesMeta[i].meta.leaves_color, 
                TreesMeta[i].meta.leavesScalar);
                //console.log(facedata);
                tree.Decompose(x, y, z, orientation, buffer, false);
        }
    }
}

PineWoodMeta = {name:"PineWood", ss: new THREE.Vector2(0, 1), size: new THREE.Vector3(32, 32, 32), t_range: new THREE.Vector2(1, 1), color: new THREE.Color(0x3C2E27), leaves_color: new THREE.Color(0x9ADA7D), leavesScalar : 2};
DeadWoodMeta = {name:"DeadWood", ss: new THREE.Vector2(0, 3), size: new THREE.Vector3(1, 1, 1), t_range: new THREE.Vector2(0.5, 3), color: new THREE.Color(0x3C2E27), leaves_color: new THREE.Color(0x9ADA7D), leavesScalar : 2};
BushMeta = {name:"Bush", ss: new THREE.Vector2(0, 6), size: new THREE.Vector3(1, 1, 1), t_range: new THREE.Vector2(0.25, 0.5), color: new THREE.Color(0x3C2E27), leaves_color: new THREE.Color(0x9ADA7D), leavesScalar : 2};
PalmMeta = {name:"Palm",  ss: new THREE.Vector2(4, 1), size: new THREE.Vector3(32, 32, 32), t_range: new THREE.Vector2(1, 1), color: new THREE.Color(0x855E42),  leaves_color: new THREE.Color(0x9ADA7D), leavesScalar : 1.55};

function CreateTree(name, ssindex, position, orientation, size, trunkMultiplier, trunkcolor, leavescolor, leavesScalar) {

    var new_tree =
        new Object_Frame(
            name,
            FACEORIENTATIONSIDENTITY,
            position,
            size,
            null
        );
    new_tree.addToOrientation(orientation);

    var new_tree_base =
        new Object_Frame(
            name + "Base",
            FACEORIENTATIONSIDENTITY,
            new THREE.Vector3(0,0,0), //ment to be local space, not world
            new THREE.Vector3(1,1,1), //ment to be local space, not world
            new_tree,
        );
        new_tree.addChild(new_tree_base);

    var half = size.y / 2.0;
    var trunkHeight = trunkMultiplier;//randomRange(trunkRange.x, trunkRange.y);
    var trunkHeightDif = (half * (1 - trunkHeight));


    var pixelSize = (size.y / 32);
    var rootSpriteDiffrence = ((size.y) - (pixelSize * 6)) / 2.0;//has to be hardcoded for now :(

    var trunkPos = (half - rootSpriteDiffrence) + (((half)) - (half * trunkHeight)) - trunkHeightDif;
    var branchesPos = (trunkPos + (half) + ((size.y * trunkHeight) / 2.0)) - trunkHeightDif;

    //Roots ------------------------------------------------------------------------------
    new_tree_base.CreateBox3D(
        [
            MapToSS(ssindex.x, ssindex.y), //index of 1
        ],
        size,
        new THREE.Vector2(1, 1),
        [
            trunkcolor
        ],
        new THREE.Vector3(0, 0, 0),
    );
    //Roots ------------------------------------------------------------------------------

    //Trunk ------------------------------------------------------------------------------
    new_tree_base.Create3D(
        [
            MapToSS(ssindex.x + 1, ssindex.y), //index of 1
        ],
        new THREE.Vector3(size.x, size.y * trunkHeight, size.z),
        new THREE.Vector2(1, 1),
        [
            trunkcolor
        ],
        new THREE.Vector3(0, trunkPos, 0),
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
        new THREE.Vector3(0, branchesPos, 0),
    );
    //Branches ---------------------------------------------------------------------------

    //Leaves ---------------------------------------------------------------------------
     var new_tree_leaves =
     new Object_Frame(
         name + "_leaves",
         FACEORIENTATIONSIDENTITY,
         new THREE.Vector3(0,0,0),
         new THREE.Vector3(1,1,1),
         new_tree,
     );
     //new_tree_leaves.setOrientation();
     var leavesMult = (half - rootSpriteDiffrence) + leavesScalar;
     var leavespos = branchesPos + (1.0 * ((leavesMult  - 1)));

     new_tree_leaves.addComponent(new Decomposer(
         [MapToSS(ssindex.x + 3, ssindex.y)],
         new THREE.Vector3(size.x * leavesScalar, size.y * leavesScalar, size.z * leavesScalar),
         new THREE.Vector3(1,1),
         [
             leavescolor
         ],
         new THREE.Vector3(0, leavespos, 0), 0, new_tree_leaves
     ));
  
   // //Leaves ---------------------------------------------------------------------------

    new_tree.addChild(new_tree_leaves);

    return new_tree;
}

var TreesMeta = [
    {hex: 0x9f9f9f, meta: PineWoodMeta, array: []},
    {hex: 0x4b004b, meta: DeadWoodMeta, array: []},
    {hex: 0x4b9600, meta: BushMeta, array: []},
    {hex: 0xff0000, meta: PalmMeta, array: []},
];
