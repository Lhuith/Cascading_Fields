var Clouds;
var cloudMin, cloudMax = 40000;
var cloudSpeed = 400;
var cloudsGoingRight = true;
var cloudsGoingLeft = false;
var cloudDirection = 1;


function AnimateClouds(delta) {
    if (Math.abs(Clouds.position.x) > cloudMax && cloudsGoingLeft) {
        cloudDirection = 1;
        cloudsGoingLeft = false;
        cloudsGoingRight = true;
    }
    else if (Math.abs(Clouds.position.x) > cloudMax && cloudsGoingRight) {
        cloudDirection = -1;
        cloudsGoingLeft = true;
        cloudsGoingRight = false;
    }

    Clouds.position.x += (delta * cloudSpeed) * cloudDirection;


}