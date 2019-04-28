var collisionCheck;
var outofbounds;
var colliding;

function CreateBounds(scene){
    
    var geometry = new THREE.BoxGeometry(((textureSize) * mapScale), 4000, (textureSize) * mapScale);
    var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    outofbounds = new THREE.Mesh(geometry, material);
    outofbounds.position.x -= (textureSize / 32) * mapScale
    outofbounds.visible = false;

    //boxHelper = new THREE.BoxHelper(outofbounds);
    //boxHelper.material.color.set(0xffffff);

    scene.add(outofbounds);
}

function CreatePlayerCollider(scene){
    var geometry = new THREE.BoxGeometry(5, 5, 5);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    playerBox = new THREE.Mesh(geometry, material);

    var geometry = new THREE.BoxGeometry(1000, 1000, 1000);
    var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    playerMarkerBox = new THREE.Mesh(geometry, material);

    playerBox.add(playerMarkerBox);
    scene.add(playerBox);
}

function FrustrumIntersection(object) {
    var frustum = new THREE.Frustum();
    var cameraViewProjectionMatrix = new THREE.Matrix4();

    // every time the camera or objects change position (or every frame)

    camera.updateMatrixWorld(); // make sure the camera matrix is updated
    camera.matrixWorldInverse.getInverse(camera.matrixWorld);
    cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromMatrix(cameraViewProjectionMatrix);

    // frustum is now ready to check all the objects you need

    if (object.isSprite) {
        return frustum.intersectsSprite(object);
    } else {
        return frustum.intersectsObject(object);
    }

}

function SimpleCollision(delta) {
    colliding = false;
    var friction = 1.0;

    for (var i = 0; i < collisionCheck.length; i++) {

        var child = collisionCheck[i];
        //console.log(child);
        if (!child.isSprite) {

            if (detectCollisionCubes(child, playerBox)) {
                var childvector = new THREE.Vector3();
                childvector.setFromMatrixPosition(child.matrixWorld);

                colliding = true;

                var reflection = new THREE.Vector3();//velocity.reflect(dir);
                reflection.copy(velocity)
                reflection.reflect(velocity.normalize());


                velocity.x += reflection.x * 1.15;
                velocity.z += reflection.z * 1.15;
                break;
            }
        }
    }

    if (!detectCollisionCubes(outofbounds, playerBox)) {
        colliding = true;

        var reflection = new THREE.Vector3();//velocity.reflect(dir);
        reflection.copy(velocity)
        reflection.reflect(velocity.normalize());


        velocity.x += reflection.x * 1.15;
        velocity.z += reflection.z * 1.15;
    }

}

function detectCollisionCubes(object1, object2) {
    object1.geometry.computeBoundingBox(); //not needed if its already calculated
    object2.geometry.computeBoundingBox();
    object1.updateMatrixWorld();
    object2.updateMatrixWorld();

    var box1 = object1.geometry.boundingBox.clone();
    box1.applyMatrix4(object1.matrixWorld);

    var box2 = object2.geometry.boundingBox.clone();
    box2.applyMatrix4(object2.matrixWorld);

    return box1.intersectsBox(box2);
}

function GetCharHeight(raycaster, vector) {

    var NewVector = new THREE.Vector3(
        vector.x,
        0,
        vector.z);

    raycaster.ray.origin.copy(NewVector);
    raycaster.ray.origin.y -= 1;

    var intersections = raycaster.intersectObjects(objects);

    var onObject = intersections.length > 0;
    var height = 0;

    if (intersections[0] !== undefined) {
        height = intersections[0].point.y;
    }
    else {
        height = 40;

    }
    return height;
}

function GetCharHeightAndOrientation(raycaster, vector) {

    var NewVector = new THREE.Vector3(
        vector.x,
        0,
        vector.z);

    raycaster.ray.origin.copy(NewVector);
    raycaster.ray.origin.y -= 1;

    var intersections = raycaster.intersectObjects(objects);

    var onObject = intersections.length > 0;
    var height = 0;
    var axs = new THREE.Vector3(0, 1, 0);
    var rads = 1.0;



    if (intersections[0] !== undefined) {
        height = intersections[0].point.y;

        if (intersections[2] !== undefined) {
            var vec = intersections[2].face.normal.clone();

            var up = new THREE.Vector3(0, 1, 0);

            // we want the cone to point in the direction of the face normal
            // determine an axis to rotate around
            // cross will not work if vec == +up or -up, so there is a special case
            if (vec.y == 1 || vec.y == -1) {
                var axis = new THREE.Vector3(1, 0, 0);
            } else {
                var axis = new THREE.Vector3().crossVectors(up, vec);
            }

            //determine the amount to rotate
            var radians = Math.acos(vec.dot(up));

            axs = axis;
            rads = radians;
        }
    }
    else {
        height = 40;

    }
    return { y: height, axis: axs, radians: rads };
}

function GetHeight() {

    var vector = new THREE.Vector3(
        controls.getObject().position.x,
        0,
        controls.getObject().position.z);

    raycaster_U.ray.origin.copy(vector);
    raycaster_U.ray.origin.y -= 1;

    var intersections = raycaster_U.intersectObjects(objects);

    var onObject = intersections.length > 0;
    var height = 0;

    if (intersections[0] !== undefined)
        height = intersections[0].point.y + 40;
    else
        height = 40;

    return height;
}

function DistanceCollisionManage(ObjectList, Threshold) {
    var vector = controls.getObject().position;

    if (ObjectList !== undefined) {
        ObjectList.updateMatrixWorld();
        ObjectList.traverse(function (child) {

            if (child !== ObjectList) {
                var childvector = new THREE.Vector3();
                childvector.setFromMatrixPosition(child.matrixWorld);

                if ((childvector.distanceTo(vector) > Threshold)) {

                    var index = collisionCheck.indexOf(child);
                    if (index > -1) {
                        collisionCheck.splice(index, 1);
                    }

                } else if ((childvector.distanceTo(vector) < (Threshold - 0.01))) {

                    var index = collisionCheck.indexOf(child);
                    if (index == -1) {
                        collisionCheck.push(child);
                    }

                }

            }
        });
    }
}

function ShowHideObjects(ObjectList, Threshold, doChildren = false, doDistance = true) {
    var vector = controls.getObject().position;

    if (ObjectList !== undefined) {
        ObjectList.updateMatrixWorld();
        ObjectList.traverse(function (child) {

            if (child !== ObjectList) {
                var childvector = new THREE.Vector3();
                childvector.setFromMatrixPosition(child.matrixWorld);

                if ((childvector.distanceTo(vector) > Threshold && doDistance) || FrustrumIntersection(child) == false) {
                    child.visible = false;

                    if (doChildren) {
                        child.traverse(function (children) {

                            if (child.visible)
                                children.visible = false;

                        });
                    }

                    //MainScene.remove(child);
                } else if ((childvector.distanceTo(vector) < (Threshold - 0.01) && doDistance) || FrustrumIntersection(child) == true) {
                    child.visible = true;
                    //MainScene.add(child);

                    if (doChildren) {
                        child.traverse(function (children) {

                            if (!child.visible)
                                children.visible = true;
                        });
                    }
                }

            }
        });
    }
}

function HandleCollisions(){

    var raySampler = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0);
    
    if(Soups != undefined){
        //console.log(Soups);
        var currentP = new THREE.Vector3();
        var currentS = new THREE.Vector3();
        var currentC = new THREE.Vector3();

        if(Soups[0] != undefined){
            //console.log(critters.offsets);
            for(var i = 0; i < Soups[0].offsets.count; i++){

                //scene.updateMatrixWorld();

                currentP.fromArray(Soups[0].offsets.array, i * 3);
                currentC.fromArray(Soups[0].color.array, i * 3);
                currentS.fromArray(Soups[0].scales.array, i * 3);
                
                var distance =  controls.getObject().position.distanceTo(currentP);

                //scene.add(outofbounds);

                if(distance < 200){
                    Soups[0].color.setXYZ(i, 0.0, 1.0, 0.0);
                    

                    var diffX = currentP.x - controls.getObject().position.x;
                    var diffZ = currentP.z - controls.getObject().position.z;
                    
                    var d = Math.sqrt(diffX * diffX + diffZ * diffZ);

                    var pushed_vec = new THREE.Vector3(currentP.x + diffX, currentP.y, currentP.z + diffZ)

                    var y = 1;//GetCharHeight(raySampler, pushed_vec);

                  
                    Soups[0].offsets.setXYZ(
                        i, 
                        (pushed_vec.x), 
                        y + currentS.y/2, 
                        (pushed_vec.z));
                    //console.log("Cant belieave this worked");
                } 
            }
            Soups[0].color.needsUpdate = true;
            Soups[0].offsets.needsUpdate = true;
        }
    }
}