import {
    frictionlessMaterial
} from "./frictions"
import * as THREE from 'three';
import * as CANNON from 'cannon';

var nextCubeDirection: number = 0;
var currentCube: THREE.Mesh|null = null;
export const cubes: THREE.Mesh[] = [];
const maxCubes = 50; // Number of cubes to show at once

export function createCube(i: number, world: CANNON.World) {
    const cubeSize = 1;
    const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const material = new THREE.MeshBasicMaterial({ color: 0xc0c0c0 });
    const cube = new THREE.Mesh(geometry, material);

    // Add wireframe
    const edges = new THREE.EdgesGeometry(geometry);
    const wireframe = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    
    
    cube.add(wireframe);
    
    const position = i<4? (new THREE.Vector3(0, 0, i)):generateNextPosition();

    cube.position.copy(position);
    // Create the physics body for the cube
    const halfExtents = new CANNON.Vec3(cubeSize/2, cubeSize/2, cubeSize/2);
    const boxShape = new CANNON.Box(halfExtents);
    const boxBody = new CANNON.Body({
        mass: 0,  // mass of 0 makes it static
        shape: boxShape,
        material: frictionlessMaterial,  // Apply frictionless material
        position: new CANNON.Vec3(cube.position.x, cube.position.y, cube.position.z)
    });

    // Add the body to the physics world
    world.addBody(boxBody);

    // Store the physics body reference in the mesh
    cube.userData.physicsBody = boxBody;

    return cube;
}
function generateNextPosition() {
    nextCubeDirection = Math.random() < 0.5 ? 0 : 1;
    const prevPos = currentCube!.position;
    const spacing = 1; 

    if (nextCubeDirection === 0) {
        return new THREE.Vector3(prevPos.x + spacing, prevPos.y, prevPos.z);
    } else {
        return new THREE.Vector3(prevPos.x, prevPos.y, prevPos.z + spacing);
    }
}
export function initialCubes(world: CANNON.World, scene: THREE.Scene){
    for (let i = 0; i < maxCubes; i++) {
        const cube = createCube(i, world);
        currentCube = cube;
        scene.add(cube);
        cubes.push(cube);
    }
}

export function newCube(world: CANNON.World, scene: THREE.Scene) {
    if (cubes.length > 0) {
        const cube = createCube(maxCubes, world);
        currentCube = cube;
        scene.add(cube);
        cubes.push(cube);
    }
}


// Function to make cube fall
export function makeCubeFall(cube, world: CANNON.World, scene: THREE.Scene) {
    if (cube.userData.physicsBody && cube.userData.physicsBody.mass === 0) {
        // Remove the old static body
        world.remove(cube.userData.physicsBody);
        
        // Create new dynamic body
        const cubeSize = 1;
        const halfExtents = new CANNON.Vec3(cubeSize/2, cubeSize/2, cubeSize/2);
        const boxShape = new CANNON.Box(halfExtents);
        const boxBody = new CANNON.Body({
            mass: 1, // Give it mass to make it dynamic
            shape: boxShape,
            position: new CANNON.Vec3(
                cube.position.x,
                cube.position.y,
                cube.position.z
            )
        });
        
        // Add the new body to the physics world
        world.addBody(boxBody);
        
        // Update the reference
        cube.userData.physicsBody = boxBody;
        setTimeout(()=>{
            // Remove fallen cube
            if (cube.userData.physicsBody) {
                world.remove(cube.userData.physicsBody);
            }
            scene.remove(cube);
            // Remove from cubes array
            const index = cubes.indexOf(cube);
            if (index > -1) {
                cubes.splice(index, 1);
            }
            newCube(world, scene);
    
        }, 1000)
    }
}
