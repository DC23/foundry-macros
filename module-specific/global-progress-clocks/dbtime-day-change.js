/*
A macro for the Foundry virtual tabletop.

Part of the Dragonbane Time collection.

This macro is called when the day changes.

Foundry v12
Version 1.0
*/

ChatMessage.create({
    speaker: { actor: game.user.id },
    content: 'A new day dawns!',
})