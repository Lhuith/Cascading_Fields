



function GenerateEnviromentalDecal(scale, size, imagedata, world, animatedWorld, ShaderInformation, SpriteSheetSize, SpriteSize) {

    var ForestBuffer = {
        offsets: [],
        orientations: [],
        vector: new THREE.Vector4(),
        scales: [],
        colors: [],
        uvoffsets: [],
        animationFrame: [],
        typeSwitch: []
    }

    var EnviromentBuffer = {
        offsets: [],
        orientations: [],
        vector: new THREE.Vector4(),
        scales: [],
        colors: [],
        uvoffsets: [],
        animationFrame: [],
        typeSwitch: []
    }

    var StructureBuffer = {
        offsets: [],
        orientations: [],
        vector: new THREE.Vector4(),
        scales: [],
        colors: [],
        uvoffsets: [],
        animationFrame: [],
        typeSwitch: []
    }

    var CreatureBuffer = {
        offsets: [],
        orientations: [],
        vector: new THREE.Vector4(),
        scales: [],
        colors: [],
        uvoffsets: [],
        animationFrame: [],
        typeSwitch: []
    }
    var createtureSoupRaw = {offsets:'', scales:'', orientation:'',color:'',length:0};


    var ElementBuffer = {
        offsets: [],
        orientations: [],
        vector: new THREE.Vector4(),
        scales: [],
        colors: [],
        uvoffsets: [],
        animationFrame: [],
        typeSwitch: []
    }

    var raySampler = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0);
    var testing = true;

    var rIndex, gIndex, bIndex, aIndex = 0;
    var red, green, blue, alpha = 0;
    var SampledColor;

    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {

           rIndex = ((i * size + j) * 4);
           gIndex = ((i * size + j) * 4) + 1;
           bIndex = ((i * size + j) * 4) + 2;
           aIndex = ((i * size + j) * 4) + 3;

           red = imagedata.data[rIndex];
           green = imagedata.data[gIndex];
           blue = imagedata.data[bIndex];
           alpha = imagedata.data[aIndex];

           SampledColor = new THREE.Color(red/255,green/255,blue/255,1.0);

            //console.log(g);
            var x = ((i * scale) - (size * scale) / 2.0) - (((size * scale / 2.0)) / 16);
            var z = ((j * scale) - (size * scale) / 2.0) - (((size * scale / 2.0)) / 16);

            //FetchTrees(SampledColor.getHex(), z, 1.0, x, ForestBuffer, EnviromentBuffer, raySampler, world, 0.2);
            //FetchEnviroment(SampledColor.getHex(), z, 1.0, x, EnviromentBuffer, raySampler);
            //FetchCritter(SampledColor.getHex(), z, 1.0, x, CreatureBuffer, raySampler);
            //FetchElement(SampledColor.getHex(), z, 1.0, x, ElementBuffer, raySampler, 0.4);
            //FetchStructure(SampledColor.getHex(), z, 1.0, x, StructureBuffer, raySampler);

            //FetchTrees(SampledColor.getHex(), z, 1.0, x, ForestBuffer, EnviromentBuffer, raySampler, world, 0.2);
            //FetchStructure(SampledColor.getHex(), z, 1.0, x, StructureBuffer, raySampler);
        }
    }


    //Will change world objects to chunks, to switch them off and save memory
    //CreateInstance(world, ForestBuffer, SpriteSheetSize, ShaderInformation, 0, false, true);
    //CreateInstance(world, StructureBuffer, SpriteSheetSize, ShaderInformation, 1, false, true);
    //CreateInstance("Critters", animatedWorld, CreatureBuffer, SpriteSheetSize, ShaderInformation, 2, true, false);
    //CreateInstance(world, EnviromentBuffer, SpriteSheetSize, SpriteSize, ShaderInformation, 'img/Game_File/enviromental_SpriteSheet.png', true, false);
    //CreateInstance(animatedWorld, CreatureBuffer, SpriteSheetSize, SpriteSize, ShaderInformation, 'img/Game_File/creatures.png', true, true, true);
    //Soups.push(new ObjectSoup("Creatures", createtureSoupRaw.offsets, createtureSoupRaw.scales, createtureSoupRaw.orientation, createtureSoupRaw.color, createtureSoupRaw.length));

    //console.log(Soups);
}


function PopulateBuffer(position, orient, scale, buffer, renderer){

    var yOffets = (renderer.size.y) / 2.0;

    buffer.scales.push(scale.x, scale.y, scale.z);

    buffer.vector.set(position.x, position.y, position.z, 0).normalize();

    buffer.offsets.push(
        position.x + buffer.vector.x + renderer.posOffsets.x, 
        position.y + buffer.vector.y + yOffets + renderer.posOffsets.y, 
        position.z + buffer.vector.z + renderer.posOffsets.z);

    buffer.vector.set(position.x, position.y, position.z).normalize();

    //console.log(orient);

    //var rotation = new THREE.Quaternion().setFromEuler(renderer.orientation);
//
    //var newRot = orient.multiply(rotation);
    //newRot.normalize();

    //-------- Orientation -------
    buffer.orientations.push(orient.x, orient.y, orient.z, orient.w);
    //-------- Orientation -------

    var col = renderer.colors[randomRangeRound(0, renderer.colors.length - 1)];
    buffer.colors.push(col.r, col.g, col.b);

    var uvs = renderer.ssIndex[randomRangeRound(0, renderer.ssIndex.length - 1)];

    buffer.uvoffsets.push(uvs.x, uvs.y);

    buffer.animationFrame.push(renderer.animationFrames.x, renderer.animationFrames.y);

    buffer.typeSwitch.push(renderer.typeSwitch);

    buffer.normals.push(0.0, 1.0, 0.0);


    //keep track of number of objects
    //buffer.objectslength += 1;
}

function CreateInstance(id, world, buffer, SpriteSheetSize, shader, urlindex, Animate, is3D = false) {

    var bufferGeometry = new THREE.PlaneBufferGeometry(1, 1, 1); //new THREE.BoxBufferGeometry( 2, 2, 2 );
    bufferGeometry.castShadow = true;

    var geometry = new THREE.InstancedBufferGeometry();
    geometry.index = bufferGeometry.index;
    geometry.attributes.position = bufferGeometry.attributes.position;
    geometry.attributes.uv = bufferGeometry.attributes.uv;

    offsetAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.offsets), 3);
    orientationAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.orientations), 4);
    colorAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.colors), 3);
    uvOffsetAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.uvoffsets), 2);
    scaleAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.scales), 3);
    animationFrameAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.animationFrame), 2);
    typeSwitchAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.typeSwitch), 1);
    normalsAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.normals), 3);

    Soups.push(
        {
            id: id,
            offsets: offsetAttribute, 
            orientation: orientationAttribute,
            color: colorAttribute,
            scales: scaleAttribute,
            length: buffer.objectslength,
        }
    )
   
    geometry.addAttribute('offset', offsetAttribute);
    geometry.addAttribute('orientation', orientationAttribute);
    geometry.addAttribute('col', colorAttribute);
    geometry.addAttribute('uvoffset', uvOffsetAttribute);
    geometry.addAttribute('scaleInstance', scaleAttribute);
    geometry.addAttribute('animationFrame', animationFrameAttribute);
    geometry.addAttribute('typeSwitch', typeSwitchAttribute);
    geometry.addAttribute('normal', normalsAttribute);

    var texture = new THREE.TextureLoader().load(MapFileurl[urlindex]);

    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    var animationSwitch = 0;
    var is3DSwitch = 0;

    if (Animate)
        animationSwitch = 1.0;

    if(is3D)
        is3DSwitch = 1.0;
    console.log(new THREE.Object3D().normalMatrix);

    var instanceUniforms = {
        map: { value: texture },
        spriteSheetX: { type: "f", value: SpriteSheetSize.x },
        spriteSheetY: { type: "f", value: SpriteSheetSize.y },
        animationSwitch: { type: "f", value: animationSwitch },
        is3D: { type: "f", value: is3DSwitch },
        time: { type: "f", value: 1.0 },
        //normalMatrix: { type: "m3v", value: ""}
    }

    var material = new THREE.RawShaderMaterial({
        uniforms:
            THREE.UniformsUtils.merge([
                THREE.UniformsLib['lights'],
                THREE.UniformsLib['fog'],
                instanceUniforms
            ]),

        vertexShader: shader.vert,
        fragmentShader: shader.frag,
        wireframe: shader.extra.wf,
        transparent: shader.extra.trans,
        fog: true,
        lights: true,
    });

    mesh = new THREE.Mesh(geometry, material);
    // object3d.castShadow = true;
    material.uniforms.map.value = texture;
    //material.uniforms.map.repeat = new THREE.Vector2(2 / SpriteSheetSize.x, 2 / SpriteSheetSize.y);
    material.uniforms.spriteSheetX.value = SpriteSheetSize.x;
    material.uniforms.spriteSheetY.value = SpriteSheetSize.y;

    //var test_obj = new THREE.Object3D();
    //test_obj

   // material.uniforms.normalMatrix.value = test_obj.normalMatrix;

    material.side = THREE.DoubleSide;
    mesh.frustumCulled = false;
    mesh.castShadow = true;
    
    //var helper = new THREE.VertexNormalsHelper( mesh, 21, 0x00ff00, 20 );
   // world.add(helper);
    world.add(mesh);
}

