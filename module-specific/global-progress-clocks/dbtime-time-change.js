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
 * This code will execute whenever the time changes to an even hour, even if you don't have
 * the optional Hour clock enabled, while anything placed into dbtime-hour-change 
 * is only called when the Hour clock is in use.
 */
if (scope.newTime.stretch % 4 === 0) {
    // post the time to chat
    const macro = game.macros.getName('dbtime-engine')
    await macro.execute({ mode: 'tell', includeDay: true })

    // you can add anything else you want here
}
