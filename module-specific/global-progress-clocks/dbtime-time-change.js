/*
A macro for the Foundry virtual tabletop.

Part of the Dragonbane Time collection.

This macro is called when the time has changed.
Unlike the stretch, hour, shift, and day change macros which are only called when those particular 
clocks have changed, this script is always called when the time is changed in any way.

Foundry v12
Version 1.1
*/

/**
 * This code will execute whenever the time changes to an even hour, even if you don't have the optional Hour clock
 * enabled, while anything placed into dbtime-hour-change is only called when the Hour clock
 * is in use.
 */
 if (scope.time.stretch % 4 === 0) {
    // it's the start of a new hour

    if (scope.time.stretch === 0 && scope.time.shift === 0) {
        // special case: 6am, the start of a new day! If you want to mark the occasion, you can do it here
        // you can also just use the dbtime-day-change macro :)
    }

    // post the time to chat
    let content = `It's ${scope.time.time} on day ${scope.time.day + 1}` // display in 1-based days
    ChatMessage.create({
        speaker: { actor: game.user.id },
        content: content,
    })
}

/**
 * Scene Lighting Automation
 *
 * Dawn Sequence
 *
 * NIGHT_DARKNESS
 *
 * 6:00 am -> shift 0, stretch 0
 * 6:15 am -> shift 0, stretch 1
 * 6:30 am -> shift 0, stretch 2
 * 6:45 am -> shift 0, stretch 3
 * 7:00 am -> shift 0, stretch 4
 *
 * DAY_DARKNESS
 *
 * Sunset Sequence
 * 6:00 pm -> shift 2, stretch 0
 * 6:15 pm -> shift 2, stretch 1
 * 6:30 pm -> shift 2, stretch 2
 * 6:45 pm -> shift 2, stretch 3
 * 7:00 pm -> shift 2, stretch 4
 *
 * NIGHT_DARKNESS
 */
