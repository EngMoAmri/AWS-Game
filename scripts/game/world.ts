import {
    frictionlessContactMaterial
} from "./frictions"
import * as CANNON from 'cannon';
// Create a physics world
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // Set gravity

// Add the contact material to the world
world.addContactMaterial(frictionlessContactMaterial);

// Set the default contact material
world.defaultContactMaterial = frictionlessContactMaterial;

export{
    world
}