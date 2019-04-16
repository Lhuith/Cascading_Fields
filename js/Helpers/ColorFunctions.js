var ColorPalletes =
[

    cloudColors = 
    [
    new ColorData (0x000000, new THREE.Color(0, 0, 0)),
    new ColorData (0xffffff, new THREE.Color(255, 255, 255)),
    ],

    lushColors = 
    [
    new ColorData (0x008CFF, new THREE.Color( 0, 140, 255)), // Water
    new ColorData (0x00A5C9, new THREE.Color( 0, 165, 201)), // Medium Water
    new ColorData (0x66B3FF, new THREE.Color( 102, 179, 255 )), // Shallow Water
    new ColorData (0xF4C67F, new THREE.Color( 244, 198, 127 )), // Sand  
    new ColorData (0x3F7C18, new THREE.Color( 63,124,24)), //Grass 1
    new ColorData (0x306712, new THREE.Color( 48,103,18)), // Grass 2
    new ColorData (0x7E5D2B, new THREE.Color( 126,93,43)), // Rock 1
    new ColorData (0x675A33, new THREE.Color( 103,90,51)), //Rock 2
    new ColorData (0x626457, new THREE.Color( 98,100,87)), // Rock 3
    new ColorData (0xF0F8FF, new THREE.Color( 240,248,255)), // Tip
    ],
];

//Credit to Pimp Trizkit : https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
function shadeRGBColor(color, percent) 
{
    var t = percent < 0 ? 0 : 255;
    var p = percent < 0 ? percent * -1 : percent;

    var R = color.r;
    var G = color.g;
    var B = color.b;

    return new THREE.Color( (Math.round((t-R)*p)+R), (Math.round((t-G)*p)+G), (Math.round((t-B)*p)+B), 255);
}

function shadeHEXColor(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    
    return "0x"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

function shade(color, percent)
{
    if (color.length > 7 ) return shadeRGBColor(color,percent);
    else return shadeHEXColor(color,percent);
}

function ColorData(hex, RGB)
{
    this.hex = hex;
    this.RGB = RGB;
};


