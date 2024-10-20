/*
A macro I wrote for the Foundry Discord. 
The first time it runs, it marks the selected tokens as defeated. The second time, if the token is defeated
then it calls the Item Piles API to make them lootable. I set a flag on the TokenDocument to prevent calling
the ItemPiles API repeatedly if the macro is called for tokens that are already lootable.

Foundry v11, v12
Version 1.0
*/

// Need help with a macro... I'd like to run this macro where the first time I run it,
//  it applies the defeated overlay on the selected token and the second time I run this macro,
//  if the token has the defeated overlay, it converts to a item pile.

const DEAD = CONFIG.specialStatusEffects.DEFEATED
const LOOTABLE_FLAG = 'lootable'
for (let token of canvas.tokens.controlled) {
  if (!token.document.hasStatusEffect(DEAD)) {
    // make em dead
    token.actor.toggleStatusEffect(DEAD, { overlay: true })
  } else if (!token.document.getFlag('world', LOOTABLE_FLAG)) {
    // make em lootable
    token.document.setFlag('world', LOOTABLE_FLAG, true)
    game.itempiles.API.turnTokensIntoItemPiles(token)
  }
}
