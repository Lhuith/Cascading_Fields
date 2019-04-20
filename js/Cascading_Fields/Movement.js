
var raycaster;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var playerBox;
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();

function MovementInit(camera, textureSize, mapScale) {
    
    controls = new THREE.PointerLockControls(camera);

    var blocker = document.getElementById('blocker');
    var instructions = document.getElementById('instructions');

    instructions.addEventListener('click', function () {

        controls.lock();

    }, false);

    controls.addEventListener('lock', function () {

        instructions.style.display = 'none';
        blocker.style.display = 'none';

    });

    controls.addEventListener('unlock', function () {

        blocker.style.display = 'block';
        instructions.style.display = '';

    });


    MainScene.add(controls.getObject());
    //controls.getObject().position.set((((textureSize / 2.0) * mapScale) - 125 * mapScale),
    //    40, ((textureSize / 2.0) * mapScale) - 125 * mapScale);


    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);
    raycaster_F = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, -1), 0, 1000);
    raycaster_U = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0);

}


function Movement(delta) {

    if (controls.isLocked === true) {

        var height = GetHeight();
        //console.log(height);

        //raycaster.ray.origin.copy(controls.getObject().position);
        //raycaster.ray.origin.y -= 10;

        //var intersections = raycaster.intersectObjects(objects);

        //var onObject = intersections.length > 0;

        //var time = performance.now();
        var delta = delta;//(time - prevTime) / 1000;

        velocity.x -= velocity.x * 2.0 * delta;
        velocity.z -= velocity.z * 2.0 * delta;

        //velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveLeft) - Number(moveRight);
        direction.normalize(); // this ensures consistent movements in all directions

        if (moveForward && !colliding || moveBackward && !colliding) velocity.z -= direction.z * 1200.0 * delta;
        if (moveLeft && !colliding || moveRight && !colliding) velocity.x -= direction.x * 1200.0 * delta;

        //if (onObject === true) {
        //    velocity.y = Math.max(0, velocity.y);
        //    canJump = true;
        //}
        controls.getObject().translateX(velocity.x * delta);
        controls.getObject().translateY(velocity.y * delta);
        controls.getObject().translateZ(velocity.z * delta);

        //if (controls.getObject().position.y <= height) {

        //    velocity.y = 0;
        //    controls.getObject().position.y = height;

        //    canJump = true;

        //}
        // console.log(height);

        if (controls.getObject().position.y !== height)
            controls.getObject().position.y = height;

        //prevTime = time;

        if (skyBox !== undefined)
            skyBox.position.copy(controls.getObject().position);

        playerBox.position.copy(controls.getObject().position);

        //var CameraVector = new THREE.Vector3(controls.getObject().position.x, mapCamera.position.y, controls.getObject().position.z)
        //mapCamera.position.copy(controls.getObject().position);
    }
}