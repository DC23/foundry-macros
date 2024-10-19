/* 
Clears all lighting status effects from all selected tokens.
The effect IDs must be set to match each world. 
Requires lighting status effects set via the Condition Lab module

The ID values need to be set for each world since they will be different.
First create the effects in Condition Lab then export the custom effects to JSON. The required 
ID values can then be found in the JSON.

Foundry v12
Version 1.0
*/

const TORCH_ID = '21A0QMcigCX1jIwT'
const LANTERN_ID = 'ZQW51jgZM6eSxg2O'
const CANDLE_ID = 'cDsu07FAYVo8T2Ou'
const MAGICAL_ID = 'WfKxZF6kP4PI4c1k'

for (let token of canvas.tokens.controlled) {
  for (let effect of [TORCH_ID, LANTERN_ID, CANDLE_ID, MAGICAL_ID]) {
    if (token.document.hasStatusEffect(effect)) token.actor.toggleStatusEffect(effect)
  }
}
