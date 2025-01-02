import {
    frictionlessMaterial
} from "./frictions"
import * as THREE from 'three';
import * as CANNON from 'cannon';


export function createSphere(world: CANNON.World, scene: THREE.Scene) {
    const geometry = new THREE.SphereGeometry(0.4);
    const material = new THREE.MeshBasicMaterial({ color: 0xff00c0 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.copy(new THREE.Vector3(0, 1, 0));
    // Create the physics body
    const sphereShape = new CANNON.Sphere(0.4); // Same radius as THREE.js sphere
    const sphereBody = new CANNON.Body({
        mass: 1, // Mass > 0 makes it dynamic
        shape: sphereShape,
        material: frictionlessMaterial,  // Apply frictionless material
        position: new CANNON.Vec3(sphere.position.x, sphere.position.y, sphere.position.z),
        linearDamping: 0,     // Reduce damping for smoother movement
        angularDamping: 0     // Reduce rotational damping
    });

    // Add the body to the physics world
    world.addBody(sphereBody);

    // Store the physics body reference in the mesh
    sphere.userData.physicsBody = sphereBody;

    scene.add(sphere);
    return sphere;
}
