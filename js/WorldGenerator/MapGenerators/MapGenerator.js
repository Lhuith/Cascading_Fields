function MapGenerator(octaves, persistance, lacunarity, seed, noiseScale, offset, size, scale, gridsize, isclouds, world, collision, ShaderInformation, SpriteSheetSize, SpriteSize) {

    regions = regionRoll(isclouds);
    var colorMap = new Array();
    var clampedMap = new Array();
    var regions;
    var colors = regions.ColorPallette;
    var noiseMap2D, noiseMap1D;
    var finalmap = new Array();

    if (regions.customUrl == '') {
        for (var x = 0; x < size + 1; x++) {
            clampedMap[x] = new Array();

            for (var y = 0; y < size + 1; y++) {
                clampedMap[x][y] = 0;
            }
        }

        if (!regions.isGassy) {
            noiseMap2D = GenerateNoise2DMap(size, size, seed, noiseScale, octaves, persistance, lacunarity, offset);
        }
        else
            noiseMap1D = GenerateNoise1DMap(size, size, seed, noiseScale, octaves, persistance, lacunarity, offset);

        var falloffMap = GenerateFalloffMap(size);

        for (var y = 0; y < size; y++) {
            for (var x = 0; x < size; x++) {
                if (regions.isGassy) {
                    clampedMap[x][y] = Clamp(noiseMap1D[x][y] - falloffMap[x][y], 0, 1);
                }
                else {
                    clampedMap[x][y] = Clamp(noiseMap2D[x][y] - falloffMap[x][y], 0, 1);
                }
            }
        }

        heightmap = new Array(colorMap.length);

        for (var y = 0; y < size; y++) {
            for (var x = 0; x < size; x++) {
                var currentHeight = clampedMap[x][y];
                heightmap[y * size + x] = currentHeight;

                for (var i = 0; i < regions.Data.length; i++) {
                    if (currentHeight >= regions.Data[i].height) {

                        var r = regions.ColorPallette[i % regions.ColorPallette.length].RGB.r;
                        var g = regions.ColorPallette[i % regions.ColorPallette.length].RGB.g;
                        var b = regions.ColorPallette[i % regions.ColorPallette.length].RGB.b;

                        if(currentHeight <= 0.25){
                         r = r * currentHeight * 1.4;
                         g = g * currentHeight * 1.4;
                         b = b * currentHeight * 1.4;
                        }
                        var color = new THREE.Color(r, g, b, 1.0);

                        //console.log();
                        colorMap[y * size + x] = color;
                    }
                    else {
                        break;
                    }
                }
            }
        }

        finalmap = new Array(colorMap.length * 3);

        for (var i = 0; i < finalmap.length; i += 3) {
            finalmap[i] = colorMap[i / 3].r;
            finalmap[i + 1] = colorMap[i / 3].g;
            finalmap[i + 2] = colorMap[i / 3].b;
        }

        var LandMass = new Array();

        var chunkSize = (size * scale);
        //var size = chunkSize;
        var detial = (chunkSize/gridsize)/scale; 
        //console.log(world);

        for (var y = 0; y < gridsize; y++)
            for (var x = 0; x < gridsize; x++) {
                //var meshData = ;
                LandMass.push(GenerateTerrainMesh(heightmap, (50.0 * scale), 1.0, detial, chunkSize/gridsize, x, y, size * scale, gridsize, scale));
            }
    }

    return new landInformation(finalmap, false, false, colors,
        (regions.customUrl == '') ? false : regions.customUrl, regions, LandMass);
};

function loadTexture(url) {
    return new Promise(resolve => {
      new THREE.TextureLoader().load(url, resolve);
    });
  }

function getOtherImageData( image ) {

    var canvas = document.createElement( 'canvas' );

    var width = image.width || image.naturalWidth;
    var hieght = image.height || image.naturalHeight;

    canvas.width = width;
    canvas.height = hieght;

    var context = canvas.getContext( '2d' );
    context.drawImage( image, 0, 0 );

    return context.getImageData( 0, 0, width, hieght );

}

function landInformation(map, hasAtmo, hasLiquad, colors, url, regionsInfo, landmass) {
    this.map = map;
    this.hasAtmo = hasAtmo;
    this.hasLiquad = hasLiquad;
    this.colors = colors;
    this.url = url;
    this.regionsInfo = regionsInfo;
    this.LandMass = landmass;
}

function TerrainType(name, height) {
    this.name = name;
    this.height = height;
};
