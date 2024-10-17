/* 
Macro for setting a token lighting to torch light from a status effect selection.
Will clear all other lighting status effects from the token.
Matches the torch setting of the token-lights-dragonbane.js Dialog macro.

Foundry v11, v12
Version 1.0
*/

// Bits and pieces of API calls I might need

// This is the list of current statuses
// token.actor.statuses

// also
// token.document.hasStatusEffect(id)

// I can toggle statuses with this call
// await token.actor.toggleStatusEffect(statusId)

// if I know the ID of the Condition Lab statuses for the lights,
// I can ensure the other statuses are all off.

// This will get me all the data from the ID that I get from the statuses.
// I can use that to get effect names from an id, since Condition Lab tends to hide the ID
// unless I grab it from an exported JSON file.
// ActiveEffect.fromStatusEffect(ID)

// Apply the torch lighting
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
