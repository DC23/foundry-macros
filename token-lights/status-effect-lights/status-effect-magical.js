/* 
Macro for setting a token lighting to magical light (like that from the magic trick)
from a status effect selection.
Will clear all other lighting status effects from the token.

Foundry v12
Version 1.2
*/

if (token && actor) {
  token.document.update({
    light: {
      color: '#d4d4d4',
      alpha: 0.3,
      dim: 10, // This is the light radius in metres or game units
      bright: 8, // This should be a little smaller than the dim radius
      luminosity: 0.5,
      animation: {
        type: 'fog',
        speed: 3,
        intensity: 2
      }
    }
  })
}
