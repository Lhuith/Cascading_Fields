//Async loads anything that needs to be loaded
//_______         ________
//       \       /      //
//        \     /       //
//         \   /        //
//          \ /         //
//         y._.y        //
// Rescursive Async Call Function to save me all the headaches ever

const AsycData = [];
var DONE = false;

const Async_Information = [
    { name:"Instance_Shader",type: 'shader', vert: 'js/Shaders/BillBoard/BillBoard.vs.glsl', frag: 'js/Shaders/BillBoard/BillBoard.fs.glsl', extra: {wf:false, trans:false, anim:false} },
    { name:"Cloud_Shader",type: 'shader', vert: 'js/Shaders/Cloud/Cloud.vs.glsl', frag: 'js/Shaders/Cloud/Cloud.fs.glsl', extra: {wf:false, trans:true, anim:false} },
    { name:"Sky_Shader",type: 'shader', vert: 'js/Shaders/Sky/Sky.vs.glsl', frag: 'js/Shaders/Sky/Sky.fs.glsl', extra: {wf:false, trans:false, anim:false} },
    { name:"Land_Shader",type: 'shader', vert: 'js/Shaders/Land/Land.vs.glsl', frag: 'js/Shaders/Land/Land.fs.glsl', extra: {wf:false, trans:true, anim:false}  },
    { name:"Water_Shader",type: 'shader', vert: 'js/Shaders/Water/Water.vs.glsl', frag: 'js/Shaders/Water/Water.fs.glsl', extra:  {wf:false, trans:true, anim:true}  },
    { name:"Critter_Data",type: 'json', file: 'data/critters.json'},
    { name:"World_Map_Main",type: 'texture', file: 'img/World/Main_Island.png'},
    { name:"Crab_Isle",type: 'island_textures', color_file: 'img/World/Crab_Island_color.png', height_file: 'img/World/Crab_Island.png', detail_file: 'img/World/Crab_Island_detail.png'},
    { name:"Water_Tile",type: 'island_textures', color_file: 'img/World/water_tile.png', height_file: 'img/World/water_level_color.png', detail_file: 'img/World/Crab_Island_detail.png'},
    { name:"Sun",type: 'light', properties: {hex:0xffffff, intesanity:11.1, pos:{x:0, y:1000, z:0}} },
];

//Big HeadAche
//var manager = new THREE.LoadingManager();
//manager.onProgress = function (item, loaded, total) {
//    progressBar.style.width = (loaded / total * 100) + '%';
//};

function AntLionInit() {
    DONE = false;
    //first call, no data, and just an i
    AntLionFall(Async_Information.length - 1, []);
}

function AntLionFall(i, data) {
    if (data.length != 0) AsycData.push(data);
    if (i == 0) {
        //AntLionDone(AsycData);
        if (Async_Information[i].type == 'shader')
            ShaderAntLionLoader(Async_Information[i].name, Async_Information[i].vert, Async_Information[i].frag, AntLionDone, Async_Information[i].extra, i - 1);
        else if (Async_Information[i].type == 'json')
            JsonAntLionLoader(Async_Information[i].name, Async_Information[i].file, AntLionDone, i - 1);
        else if (Async_Information[i].type == 'texture')
            TextureAntLionLoader(Async_Information[i].name, Async_Information[i].file, AntLionDone, i - 1);
        else if (Async_Information[i].type == 'island_textures'){
            IslandTexturesAntLionLoader(
                Async_Information[i].name, 
                Async_Information[i].color_file, 
                Async_Information[i].height_file, 
                Async_Information[i].detail_file, AntLionDone, i - 1);
        }
        else if(Async_Information[i].type == 'light'){
            LightAntLionLoader(
                Async_Information[i].name,
                Async_Information[i].properties.hex,
                Async_Information[i].properties.intesity,
                Async_Information[i].properties.pos, AntLionFall, i - 1
            )
        }


        return;
    }
    //this is the antlion?
    if (Async_Information[i].type == 'shader') {
        ShaderAntLionLoader(
            Async_Information[i].name,
            Async_Information[i].vert,
            Async_Information[i].frag,
            AntLionFall,
            Async_Information[i].extra,
            i - 1);
    } else if(Async_Information[i].type == 'json'){
        JsonAntLionLoader(Async_Information[i].name, Async_Information[i].file, AntLionFall, i - 1);
    } else if (Async_Information[i].type == 'texture'){
        TextureAntLionLoader(Async_Information[i].name, Async_Information[i].file, AntLionFall, i - 1);
    } else if (Async_Information[i].type == 'island_textures') {
        IslandTexturesAntLionLoader(
            Async_Information[i].name, 
            Async_Information[i].color_file, 
            Async_Information[i].height_file, 
            Async_Information[i].detail_file, AntLionFall, i - 1);
    }
    else if(Async_Information[i].type == 'light'){
        LightAntLionLoader(
            Async_Information[i].name,
            Async_Information[i].properties.hex,
            Async_Information[i].properties.intesity,
            Async_Information[i].properties.pos, AntLionFall, i - 1
        )
    }
}


function GetData(nameKey){
    for(var i = 0; i < AsycData.length; i++){
        if(AsycData[i].name == nameKey)
        return AsycData[i];
    }

    console.log("No Object Matches Name Given.");
}

function AntLionDone(i, data) {
    AsycData.push(data);
    //console.log("zah?");
    cascding_fields_loaded(AsycData);
    DONE = true;
}

function TextureAntLionLoader(name, url, onLoad, i, onProgress, onError){
    texture = new THREE.TextureLoader().load(url, function (event) {
        imagedata = getImageData(texture.image);    
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        onLoad(i, {name:name, texture: texture, texture_data:imagedata}, onProgress, onError)
    });
}

function LightAntLionLoader(name, hex, intesity, pos, onLoad, i, onProgress, onError){
    new_light = new THREE.DirectionalLight(hex, intesity);
    new_light.position.set(pos.x, pos.y, pos.z);
    new_light.name = name;
    
    onLoad(i, {name: name, light: new_light}, onProgress, onError);
}


function IslandTexturesAntLionLoader(name, urlc, urlh, urld, onLoad, i, onProgress, onError){
    texture_c = new THREE.TextureLoader().load(urlc, function (event) {
        texture_h = new THREE.TextureLoader().load(urlh, function (event) {
            texture_d = new THREE.TextureLoader().load(urld, function (event) {

        imagedata = getImageData(texture_h.image);    
        detial_data = getImageData(texture_d.image); 

        texture_c.magFilter = THREE.NearestFilter;
        texture_c.minFilter = THREE.NearestFilter;

        texture_h.magFilter = THREE.NearestFilter;
        texture_h.minFilter = THREE.NearestFilter;
        
        detial_data.magFilter = THREE.NearestFilter;
        detial_data.minFilter = THREE.NearestFilter;

        texture_d.magFilter = THREE.NearestFilter;
        texture_d.minFilter = THREE.NearestFilter;
        
       
        onLoad(i, {name:name, color: texture_c, height:imagedata, detail: detial_data, detail_test: texture_d}, onProgress, onError)

            })
        })
    });
}

// Credit to THeK3nger - https://gist.github.com/THeK3nger/300b6a62b923c913223fbd29c8b5ac73
//Sorry to any soul that bare's witness to this Abomination....May the gods have mercy on me
function JsonAntLionLoader(name, url, onLoad, i, onProgress, onError) {
    var json_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
    json_loader.setResponseType('json');
    json_loader.load(url, function (json_file) {
        onLoad(i, { name:name, file: json_file });
    }, onProgress, onError);
}

// Credit to THeK3nger - https://gist.github.com/THeK3nger/300b6a62b923c913223fbd29c8b5ac73
//Sorry to any soul that bare's witness to this Abomination....May the gods have mercy on me
function ShaderAntLionLoader(name, vertex_url, fragment_url, onLoad, Custom, i, onProgress, onError) {
    var vertex_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
    vertex_loader.setResponseType('text');
    vertex_loader.load(vertex_url, function (vertex_text) {
        var fragment_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
        fragment_loader.setResponseType('text');
        fragment_loader.load(fragment_url, function (fragment_text) {
            var shadow_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
            shadow_loader.setResponseType('text');
            shadow_loader.load("js/Shaders/Shadow.glsl", function (shadow_text) {
                var dither_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
                dither_loader.setResponseType('text');
                dither_loader.load("js/Shaders/Dither.glsl", function (dither_text) {
                    //this needs an i
                    onLoad(i, { name: name, extra: Custom, vert: textParse(vertex_text, shadow_text, dither_text), frag: textParse(fragment_text, shadow_text, dither_text) });
                }

                )
            });
        })
    }, onProgress, onError);
}

function Shader(vertex, fragment) {
    this.vertex = vertex;
    this.fragment = fragment;
}

//Yummy Yum Yum
function textParse(glsl, shadow_text, dither_text) {
    var text = glsl.replace("AddShadow", shadow_text);
    text = text.replace("AddDither", dither_text);

    return text;
}

function data_to_texture(texture, size){

    var dataTexture = new THREE.DataTexture
    (
        Uint8Array.from(texture),
        size,
        size,
        THREE.RGBFormat,
        THREE.UnsignedByteType,
    );

    dataTexture.needsUpdate = true;

    return dataTexture;
}
