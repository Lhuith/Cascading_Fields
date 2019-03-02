    /**
     * Automatically adds/removes all children which are (in)visible to the camera to a temporary group
     * if the removeInvisible flag is true.
     * Can be useful as performance work-around for many tiny sprites (> 500) in the scene. 
     * Tested with r73.
     *
     * This code is just the raw idea and not further optimized or refined yet.
     *
     * @author Oliver G. / http://magnitudo.org/
     */
    THREE.RemoveInvisibleGroup = function ( camera ) {

        THREE.Object3D.call( this );
    
        this.camera = camera;
        this.removeInvisible = true;
        this.checkBounds = true;
        
        this.removedObjGroup = new THREE.Object3D();
        this.tmpVector = new THREE.Vector3();
        this.tmpMatrix = new THREE.Matrix4();
        this.tmpFrustum = new THREE.Frustum(); 

    };

    THREE.RemoveInvisibleGroup.prototype = Object.create( THREE.Object3D.prototype );
    THREE.RemoveInvisibleGroup.prototype.constructor = THREE.RemoveInvisibleGroup;
    THREE.RemoveInvisibleGroup.prototype.update = function() {

        var i, obj;
        if ( this.removeInvisible ) {
    
            for ( i = 0; i < this.children.length; i ++ ) {
    
                obj = this.children[ i ];
    
                if ( ! this.isInFrustrum( obj ) ) {
    
                    this.removedObjGroup.add( obj );
                    this.remove( obj );
    
                }
    
            }
            for ( i = 0; i < this.removedObjGroup.children.length; i ++ ) {
    
                obj = this.removedObjGroup.children[ i ];
                if ( this.isInFrustrum( obj ) ) {
    
                    this.add( obj );
                    this.removedObjGroup.remove( obj );
    
                }
    
            }
    
        } else {
    
            // ensure removedObjGroup is empty after removeInvisible flag changed
            for ( i = 0; i < this.removedObjGroup.children.length; i ++ ) {
    
                obj = this.removedObjGroup.children[ i ];
                this.add( obj );
                this.removedObjGroup.remove( obj );
    
            }
    
        }
    
        console.log('visible: ' + this.children.length, ' invisble: ',this.removedObjGroup.children.length);

    };

    THREE.RemoveInvisibleGroup.prototype.isInFrustrum = function ( obj ) {

        if ( this.checkBounds ) {
    
            if ( obj.geometry.boundingBox == null ) {
    
                obj.geometry.computeBoundingBox();  // for a sprite -0.5 -0.5 to 0.5 0.5
    
            }
            // top left and bottom right are checked, top right and bottom left can be added to make it smooth for all movement dirs
            if ( this.isPosInFrustrum( this.tmpVector.addVectors( obj.position, obj.geometry.boundingBox.min ) ) ) {
    
                return true;
    
            } else {
    
                return this.isPosInFrustrum( this.tmpVector.addVectors( obj.position, obj.geometry.boundingBox.max ) );  
    
            }
    
        } else {
    
            return this.isPosInFrustrum( obj.position );
    
        }

    };

    // from http://stackoverflow.com/questions/29992594/three-js-conversion-from-3d-perspective-scene-to-2d-orthographic-hud-scene
    THREE.RemoveInvisibleGroup.prototype.isPosInFrustrum = function ( position ) {
        
        //var frustum = new THREE.Frustum();
        //var projScreenMatrix = new THREE.Matrix4();
    
        this.camera.updateMatrix();
        this.camera.updateMatrixWorld();
    
        //projScreenMatrix.multiplyMatrices( this.camera.projectionMatrix, this.camera.matrixWorldInverse );
    
        this.tmpFrustum.setFromMatrix( this.tmpMatrix.multiplyMatrices( this.camera.projectionMatrix, this.camera.matrixWorldInverse ) );
        return this.tmpFrustum.containsPoint ( position );

    };