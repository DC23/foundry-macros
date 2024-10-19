/* 
Macro for setting a token lighting to candle light from a status effect selection in 
the Condition Lab module

Foundry v12
Version 1.2
*/

if (token) {
  token.document.update({
    light: {
      color: '#a88115',
      alpha: 0.4,
      dim: 4, // This is the light radius in metres or game units
      bright: 3, // This should be a little smaller than the dim radius
      luminosity: 0.5,
      animation: {
        type: 'torch',
        speed: 5,
        intensity: 2
      }
    }
  })
}
