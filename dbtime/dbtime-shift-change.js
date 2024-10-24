/*
A macro for the Foundry virtual tabletop.

Part of the Dragonbane Time collection.

This macro is called when the shift clock value changes.

Foundry v12
Version 1.0
*/

/**
 * If instead of posting the current time to chat once an hour you only want it once per shift,
 * then remove or comment out the lines in dbtime-time-change and enable these instead.
 */
// post the time to chat
/*
let content = `It's ${scope.time.time} on day ${scope.time.day + 1}` // display in 1-based days
ChatMessage.create({
    speaker: { actor: game.user.id },
    content: content,
})
*/
