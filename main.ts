import * as THREE from 'three';
import { world } from './scripts/world';
import {
    createSphere,
} from "./scripts/sphere";
import { cubes, initialCubes, checkCubePassed, makeCubeFall } from './scripts/cubes';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// set the camera position to be above the cubes and behind the first one
camera.position.set(0, 5, -8);
// set the camera rotation to 180 on y axis
camera.rotation.y = Math.PI;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );
initialCubes(world, scene);

var sphere: THREE.Mesh = createSphere(world, scene);

var moveDirection = "forward";



function moveForward() {
    const speed = 1; // Adjust this value to control movement speed
    // Set velocity directly - moving along Z axis
    sphere.userData.physicsBody.velocity.set(0, 0, speed); // negative Z is forward
    // Optional: stop any rotation
    sphere.userData.physicsBody.angularVelocity.set(0, 0, 0);
}

function moveLeft() {
    const speed = 1; // Adjust this value to control movement speed
    // Set velocity directly - moving along X axis
    sphere.userData.physicsBody.velocity.set(speed, 0, 0); // negative X is left
    // Optional: stop any rotation
    sphere.userData.physicsBody.angularVelocity.set(0, 0, 0);
}

document.addEventListener('keydown', (event) => {
    if (!sphere || !sphere.userData.physicsBody) return;

    switch(event.code) {
        case 'Space':
            if(moveDirection == "forward")
            {
                moveLeft();
                moveDirection = "left";
            }else{
                moveForward();
                moveDirection = "forward";
            }
             break;
    }
});
// switch move direction on mouse and touch
document.addEventListener('mousedown', (event) => {
    if (!sphere || !sphere.userData.physicsBody) return;
    if(event.button == 0){
        if(moveDirection == "forward")
        {
            moveLeft();
            moveDirection = "left";
        }else{
            moveForward();
            moveDirection = "forward";
        }
    }

});
function updateCamera() {
    // Fixed offset from sphere
    const offset = new THREE.Vector3(0, 5, -8);
    const targetPosition = new THREE.Vector3(sphere.position.x, 5, sphere.position.z);
    camera.position.copy(targetPosition).add(offset);
    camera.lookAt(targetPosition);
}
moveForward();
var gameOver = false;
function animate() {
    if(gameOver){
        return;
    }
    // Step the physics world
    world.step(1/24); 

    // Update the sphere position based on physics
    scene.children.forEach(child => {
        if (child.userData.physicsBody) {
            child.position.copy(child.userData.physicsBody.position);
            child.quaternion.copy(child.userData.physicsBody.quaternion);
        }
    });
    // Check for passed cubes
    cubes.forEach(cube => {
        if (!cube.userData.falling && checkCubePassed(cube, sphere, moveDirection)) {
            makeCubeFall(cube, world, scene);
        }
    });

    updateCamera();
    if(sphere.position.y<-10){
        gameOver = true;
        // alert("Game Over");
        // document.location.reload();
    }
	renderer.render( scene, camera );

}
