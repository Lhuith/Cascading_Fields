function GenerateEnviromentalDecal(scale,  size, imagedata, world, objects) {
    //heightMap, heightMultiplier, _heightCurve, 

    console.log(imagedata.data.length);


    //scene.add( cube );

    for(var i = 0; i < imagedata.data.length; i+=3){
        
        if(imagedata.data[i + 2] == 60){
            var x = (i - (size * scale)) % size;
            var z = (i - (size * scale)) % size;
            console.log(x);

            var geometry = new THREE.BoxGeometry( 100, 100, 100 );
            var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
            var cube = new THREE.Mesh( geometry, material );
            cube.position.set(x, 100, z);
            world.add(cube);
        }
    }
}
