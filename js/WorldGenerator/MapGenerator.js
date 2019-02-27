function MapGenerator(octaves, persistance, lacunarity, seed, noiseScale, offset, size, isclouds, world) {

    regions = regionRoll(isclouds);
    var colorMap = new Array();
    var clampedMap = new Array();
    var regions;
    var colors = regions.ColorPallette;
    var noiseMap2D, noiseMap1D;
    var noiseMapTexture = new Array();
    var texture;
    var imagedata;
    var index = 0;
    var finalmap = new Array();
    //var meshData;
    var geo;
    console.log(size);
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
                        colorMap[y * size + x] = regions.ColorPallette[i % regions.ColorPallette.length].RGB;

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

        var finalGeo = new THREE.Object3D();

        var scale = 1.0;
        var gridsize = 8;
        var LandMass = new Array();
        var detial = 32;


        var chunkSize = (size * scale);
        var size = chunkSize;
        
        //Cant start at 0 or else vertices will be pos * 0 <--- big nono
        for (var y = 0; y < gridsize; y++)
            for (var x = 0; x < gridsize; x++) {
                //var meshData = ;
                LandMass.push(GenerateTerrainMesh(heightmap, (50.0 * scale), 1.0, detial, 
                Math.round(chunkSize/gridsize), x, y, world, size * scale, gridsize, scale));
            }
    }

    console.log(LandMass);

    return new PlanetInformation(finalmap, false, false, colors,
        (regions.customUrl == '') ? false : regions.customUrl, regions, LandMass);
};

function PlanetInformation(map, hasAtmo, hasLiquad, colors, url, regionsInfo, landmass) {
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
