import * as CANNON from 'cannon';
// Create a frictionless material in CANNON.js
const frictionlessMaterial = new CANNON.Material('frictionlessMaterial');
frictionlessMaterial.friction = 0;    // Set friction to 0
frictionlessMaterial.restitution = 0;    // Set bounce to 0
// Set up contact materials for interaction between bodies
const frictionlessContactMaterial = new CANNON.ContactMaterial(
    frictionlessMaterial,
    frictionlessMaterial,
    {
        friction: 0,      // Friction when bodies are sliding
        restitution: 0,   // Bounciness
        contactEquationStiffness: 1e8,    // Make contact more rigid
        contactEquationRelaxation: 3      // Make contact more stable
    }
);

export {
    frictionlessMaterial,
    frictionlessContactMaterial,
}