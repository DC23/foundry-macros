/*
A macro for the Foundry virtual tabletop.

Part of the Dragonbane Time collection.

This macro is called when the time has changed.
Unlike the stretch, hour, shift, and day change macros which are only called when those particular 
clocks have changed, this script is always called when the time is changed in any way.

Foundry v12
Version 1.0
*/
/**
 * This code will execute whenever the time changes to an even hour, even if you don't have the optional Hour clock
 * enabled, while anything placed into dbtime-hour-change is only called when the Hour clock
 * is in use.
 */
 if (scope.newTime.stretch % 4 === 0) {
    // it's the start of a new hour

    if (scope.newTime.stretch === 0 && scope.newTime.shift === 0) {
        // special case: 6am, the start of a new day! If you want to mark the occasion, you can do it here
        // you can also just use the dbtime-day-change macro :)
    }

    // post the time to chat
    let content = `It's ${scope.newTime.time} on day ${scope.newTime.day + 1}` // display in 1-based days
    ChatMessage.create({
        speaker: { actor: game.user.id },
        content: content,
    })
}
