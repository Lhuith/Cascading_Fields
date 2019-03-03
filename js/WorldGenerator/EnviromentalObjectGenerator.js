function GenerateEnviromentalObjects(){
    return {
        tree00: createTree(0), 

        flower00: createFlower(0),
        flower01: createFlower(1), 
    }
}

function createTree(index){

    var texture = new THREE.TextureLoader().load("img/Game_File/tree_Trunk_"+index+".png");
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    console.log(index);
    var scaleY = 100;
    var trunkGeo = new THREE.Geometry();
    var material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    //cross.setLength(14);
    for (var i = 0; i < 3; i++) {
        var material = new THREE.MeshBasicMaterial({ map: texture, color: 0xffffff });
        var mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), material);
        material.alphaTest = 0.5;
        material.transparent = false;
        mesh.rotation.y = (Math.PI / 3) * i;
        //geometry.scale.set(25, 50, 25)
        material.side = THREE.DoubleSide;
        //mesh.position.set(0, 0.5, 0);
        mesh.updateMatrix(); // as needed
        trunkGeo.merge(mesh.geometry, mesh.matrix, i);
    }

    var trunkBufferGeo = new THREE.BufferGeometry().fromGeometry(trunkGeo);

    var trunk = new THREE.Mesh(trunkGeo, material);

    //LEAVES---------------------------------------------------
    var leaves = new THREE.TextureLoader().load("img/Game_File/Tree_Leaves_"+index+".png");
    leaves.magFilter = THREE.NearestFilter;
    leaves.minFilter = THREE.NearestFilter;

    var spriteMaterial = new THREE.SpriteMaterial({ map: leaves, color: 0x49d049 , fog: true});
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(125, scaleY, 100)
    
    //sprite.position.set(trunk.position.x, trunk.position.y + scaleY, trunk.position.z);
    sprite.visible = true;
    trunk.add(sprite);
    //LEAVES---------------------------------------------------

    material.side = THREE.DoubleSide;

    trunk.scale.set(50, scaleY, 50);
    trunk.rotation.y = (randomRange(0, Math.PI));
    trunk.visible = false;

    return trunk;
};


function createFlower(index){
    
    //var flower = new THREE.TextureLoader().load("img/Game_File/flower_"+index+".png");
    //flower.magFilter = THREE.NearestFilter;
    //flower.minFilter = THREE.NearestFilter;
    //
    //var scaleY = 25;
//
    //var spriteMaterial = new THREE.SpriteMaterial({ map: flower, color: Math.random() * 0xffffff });
    //var sprite = new THREE.Sprite(spriteMaterial);
    //sprite.scale.set(25, 25, 25)

    var geometry = new THREE.PlaneBufferGeometry(25, 25, 25);

    return geometry;
}