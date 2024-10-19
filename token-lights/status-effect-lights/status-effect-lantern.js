/* 
Macro for setting a token lighting to lantern light from a status effect selection.
Will clear all other lighting status effects from the token.

Foundry v12
Version 1.2
*/

if (token && actor) {
  token.document.update({
    light: {
      color: '#a88115',
      alpha: 0.4,
      dim: 10, // This is the light radius in metres or game units
      bright: 8, // This should be a little smaller than the dim radius
      luminosity: 0.5,
      animation: {
        type: 'torch',
        speed: 3,
        intensity: 2
      }
    }
  })
}
