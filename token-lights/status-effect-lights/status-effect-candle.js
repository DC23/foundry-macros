/* 
Macro for setting a token lighting to torch light from a status effect selection.
Will clear all other lighting status effects from the token.
Matches the torch setting of the token-lights-dragonbane.js Dialog macro.

Foundry v12
Version 1.1
*/

// ID values obtained by first creating the effects in Condition Lab then exporting the custom effects to JSON.
// The ID values for each effect can then be found in the JSON.
const TORCH_ID = 'Pg7M8xPkWgBsN5QE'
const LANTERN_ID = 'vlhmJysWhlnT37pd'
const CANDLE_ID = 'SMpoK2V52jbX1gqE'
const MAGICAL_ID = 'K5IlSedG8PAqzazF'

if (token && actor) {
  // turn off the other effects for this token
  function effectOff (id) {
    if (token.document.hasStatusEffect(id)) token.actor.toggleStatusEffect(id)
  }
  ;[TORCH_ID, LANTERN_ID, MAGICAL_ID].forEach(effectOff)

  // now turn the required effect on
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
