function FetchTrees(hex, x, y, z, buffer, enviBuffer, ray, world) {
    var facedata;

    for (var i = 0; i < TreesMeta.length; i++) {

        if (hex == TreesMeta[i].hex) {
            console.log("Found Tree");
            facedata = GetCharHeightAndOrientation(ray, new THREE.Vector3(x, 0, z));
            
            var tree = CreateTree(
                TreesMeta[i].meta.name, TreesMeta[i].meta.ss, TreesMeta[i].meta.size, randomRange(TreesMeta[i].meta.t_range.x, TreesMeta[i].meta.t_range.y), TreesMeta[i].meta.color, TreesMeta[i].meta.leaves_color);

            TreesMeta[i].array.push(
                tree.Render(x, facedata.y, z, buffer));
        }
    }
}

PineWoodMeta = {name:"PineWood", ss: new THREE.Vector2(0, 1), size: new THREE.Vector3(200, 200, 200), t_range: new THREE.Vector2(1, 1), color: new THREE.Color(0x3C2E27), leaves_color: new THREE.Color(0x9ADA7D)};
DeadWoodMeta = {name:"DeadWood", ss: new THREE.Vector2(0, 3), size: new THREE.Vector3(200, 200, 200), t_range: new THREE.Vector2(0.5, 3), color: new THREE.Color(0x3C2E27), leaves_color: new THREE.Color(0x9ADA7D)};
BushMeta = {name:"Bush", ss: new THREE.Vector2(0, 6), size: new THREE.Vector3(75, 75, 75), t_range: new THREE.Vector2(0.25, 0.5), color: new THREE.Color(0x3C2E27), leaves_color: new THREE.Color(0x9ADA7D)};

function CreateTree(name, ssindex, size, trunkMultiplier, trunkcolor, leavescolor) {

    var new_tree =
        new Basic_Object(
            name,
        );

    var new_tree_base =
        new Basic_Object(
            name + "Base",
        );
    

    //Rotation TODO:

    //var mx = new THREE.Matrix4().makeRotationAxis(rotInfo.axis, rotInfo.radians);
    //var faceQ = new THREE.Quaternion().setFromRotationMatrix(mx);

    //Rotation TODO:
    var half = size.y / 2.0;
    var trunkHeight = trunkMultiplier;//randomRange(trunkRange.x, trunkRange.y);
    var trunkHeightDif = (half * (1 - trunkHeight));


    var pixelSize = (size.y / 32);
    var rootSpriteDiffrence = ((size.y) - (pixelSize * 6)) / 2.0;//has to be hardcoded for now :(

    var trunkPos = (half - rootSpriteDiffrence) + (((half)) - (half * trunkHeight)) - trunkHeightDif;
    var branchesPos = (trunkPos + (half) + ((size.y * trunkHeight) / 2.0)) - trunkHeightDif;

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
        new THREE.Vector3(size.x, size.y * trunkHeight, size.z),
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

    //Leaves ---------------------------------------------------------------------------
    var new_tree_leaves =
    new Basic_Object(
        name + "_leaves",
    );

    var leavesMult = (half - rootSpriteDiffrence) + 1.0;
    var leavespos = branchesPos + (1.0 * ((leavesMult - 1)));

    new_tree_leaves.addComponent(new Renderer(
        [MapToSS(ssindex.x + 3, ssindex.y)],
        size,
        new THREE.Vector3(1,1),
        [
            leavescolor
        ],
        new THREE.Vector3(0, leavespos, 0),
        FACEORIENTATIONSIDENTITY, 0, new_tree_leaves
    ));
    //Leaves ---------------------------------------------------------------------------


    new_tree.addChild(new_tree_base);
    new_tree.addChild(new_tree_leaves);

    //var geometry = new THREE.BoxGeometry(25, tree_object.obj.size.y, 25);
    //var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    //var cube = new THREE.Mesh(geometry, material);
    ////scene.add( cube );
    //cube.visible = false;
    //cube.position.set(x, y, z);
//
    ////boxHelper = new THREE.BoxHelper(cube);
    ////boxHelper.material.color.set(0xffffff);
    ////world.add(boxHelper);
    //worldObject.add(cube);
    ////collision.push()

    return new_tree;
}

var TreesMeta = [
    {hex: 0x9f9f9f, meta: PineWoodMeta, array: []},
    {hex: 0x4b004b, meta: DeadWoodMeta, array: []},
    {hex: 0x4b9600, meta: BushMeta, array: []},
];
