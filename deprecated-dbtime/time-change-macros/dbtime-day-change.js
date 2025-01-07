/*
A macro for the Foundry virtual tabletop.

Part of the Dragonbane Time collection.

This macro is called when the day clock value changes.
If you are not using the day clock, this macro will never be called.

Foundry v12
Version 1.0
*/

ChatMessage.create({
    speaker: { actor: game.user.id },
    content: 'A new day dawns!',
})