/* 
Simple non-UI macro for setting lighting on selected tokens to a torch effect for Dragonbane.
Matches the lantern setting of the token-lights-dragonbane.js Dialog macro.

Foundry v11, v12
Version 1.0
*/
for (let token of canvas.tokens.controlled) {
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
