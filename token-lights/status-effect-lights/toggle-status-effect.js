/* 
Toggles a status effect on the selected tokens. 
In this specific case, it's configured for the Condition Lab lighting effects I use in Dragonbane.
The ID values need to be set for each world since they will be different.
First create the effects in Condition Lab then export the custom effects to JSON. The required 
ID values can then be found in the JSON.

Foundry v12
Version 1.0
*/

const TORCH_ID = 'Pg7M8xPkWgBsN5QE'
const LANTERN_ID = 'vlhmJysWhlnT37pd'
const CANDLE_ID = 'SMpoK2V52jbX1gqE'
const MAGICAL_ID = 'K5IlSedG8PAqzazF'

for (let token of canvas.tokens.controlled) {
  token.actor.toggleStatusEffect(TORCH_ID)
}