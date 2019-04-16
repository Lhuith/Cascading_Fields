function PostImageData(map) {
    // create off-screen canvas element
    var canvastest = document.createElement('canvas');
    var ctx = canvastest.getContext('2d');
    document.getElementById("webGL-container-map_view").appendChild(canvastest);

    canvastest.width = textureSize;
    canvastest.height = textureSize;

    // create imageData object
    var idata = ctx.createImageData(textureSize, textureSize);

    // set our buffer as source
    //idata.data.set(map.image);
    //console.log(map);
    for (var x = 0; x < textureSize; x++) {
        for (var y = 0; y < textureSize; y++) {
            var idx = (x + y * textureSize) * 4;
            var idx2 = (x + y * textureSize) * 3;
            idata.data[idx + 0] = map.image.data[idx2 + 0];
            idata.data[idx + 1] = map.image.data[idx2 + 1];
            idata.data[idx + 2] = map.image.data[idx2 + 2];
            idata.data[idx + 3] = textureSize;
        }
    }
    // update canvas with new data
    ctx.putImageData(idata, 0, 0);
    var dataUri = canvastest.toDataURL('image/png'); // produces a PNG file

    $.ajax({
        type: 'POST',
        url: 'land_information_post.php',
        data: {
            image: dataUri,
        },
        success: function (d) {
            console.log('done');
        }
    });
}