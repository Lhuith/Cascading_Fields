//Credit to // Daniel Shiffman
// http://codingtra.in


//Handles Collisions and Occlusion
function Rectangle(x, y, w, h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

Rectangle.prototype.Contains = function(object){
    var pos = object.position;
    return(
        pos.x >= this.x - this.w &&
        pos.x <= this.x + this.w &&
        pos.z >= this.y - this.h &&
        pos.z <= this.y + this.h);
}


Rectangle.prototype.Intersects = function(range){
    return!(
        range.x - range.w > this.x + this.w ||
        range.x + range.w < this.x - this.w ||
        range.y - range.h > this.y + this.h ||
        range.y + range.h < this.y - this.h);
}

//work this to use the map as the boundry

function Quad_Tree(boundry, capacity){
    this.boundry = boundry;
    this.capacity = capacity;
    this.objects = [];
    this.divided = false;
}

Quad_Tree.prototype.Subdivide = function(){
    //console.log("Please No");
    var x = this.boundry.x;
    var y = this.boundry.y;
    var w = this.boundry.w /2;
    var h = this.boundry.h /2;

    var ne = new Rectangle(x + w, y - h, w, h);
    this.northeast = new Quad_Tree(ne, this.capacity);
    var nw = new Rectangle(x - w, y - h, w, h);
    this.northwest = new Quad_Tree(nw, this.capacity);
    var se = new Rectangle(x + w, y + h, w, h);
    this.southeast = new Quad_Tree(se, this.capacity);
    var sw = new Rectangle(x - w, y + h, w, h);
    this.southwest = new Quad_Tree(sw, this.capacity);

    this.divided = true;
}

Quad_Tree.prototype.Insert = function(object){

    //console.log(object);
    if(!this.boundry.Contains(object)){
        return false;
    }

    if(this.objects.length < this.capacity){
        this.objects.push(object);
        return true;
    }

    if(!this.divided){
        this.Subdivide();
    }

    return(
    this.northeast.Insert(object) || 
    this.northwest.Insert(object) ||
    this.southeast.Insert(object) ||
    this.southwest.Insert(object));
}

Quad_Tree.prototype.Query = function(range, found){
    if(!found){
        found = [];
    }

    if(!range.Intersects(this.boundry)){
        return found;
    }

    objects.forEach(function(o){
        found.push(o);
    });

    if(this.divided){
        this.northwest.Query(range, found);
        this.northeast.Query(range, found);
        this.southwest.Query(range, found);
        this.southeast.Query(range, found);
    }

    }
