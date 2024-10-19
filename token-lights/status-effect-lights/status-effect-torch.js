/* 
Macro for setting a token lighting to torch light from a status effect selection.
Will clear all other lighting status effects from the token.
Matches the torch setting of the token-lights-dragonbane.js Dialog macro.

Foundry v12
Version 1.2
*/

if (token && actor) {
  token.document.update({
    light: {
      color: '#a88115',
      alpha: 0.4,
      dim: 10, // This is the torch radius in metres or game units
      bright: 7.2, // This should be a little smaller than the dim radius
      luminosity: 0.5,
      animation: {
        type: 'torch',
        speed: 5,
        intensity: 2
      }
    }
  })
}
