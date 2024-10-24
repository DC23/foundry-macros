/*
A macro for the Foundry virtual tabletop.

Part of the Dragonbane Time collection.

This macro is called when the time has changed.
Unlike the stretch, hour, shift, and day change macros which are only called when those particular 
clocks have changed, this script is always called when the time is changed in any way.

Foundry v12
Version 1.6
*/

//----------------------------------------------------------------------

/**
 * This code will execute whenever the time changes to an even hour, even if you don't have the optional Hour clock
 * enabled, while anything placed into dbtime-hour-change is only called when the Hour clock
 * is in use.
 */
if (scope.time.stretch % 4 === 0) {
    // it's the start of a new hour

    if (scope.time.stretch === 0 && scope.time.shift === 0) {
        // special case: 6am, the start of a new day! If you want to mark the occasion, you can do it here
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
 * An example of how the time handling system can be used to drive more complex automations.
 * Just delete this whole section if you don't want to automatically change scene 
 * lighting based on the time of day.
 *
 * Shift 0 is 6am to 12pm
 * Shift 1 is 12pm to 6pm
 * Shift 2 is 6pm to 12am
 * Shift 3 is 12am to 6am
 *
 * Shifts 0 & 1 are daylight shifts, while 2 & 3 are night shifts.
 * Sunrise is from 6am to 7am
 * Sunset is from 6pm to 7pm
 *
 * 6:00 am -> shift 0, stretch 0
 * 6:15 am -> shift 0, stretch 1
 * 6:30 am -> shift 0, stretch 2
 * 6:45 am -> shift 0, stretch 3
 * 7:00 am -> shift 0, stretch 4
 *
 * 6:00 pm -> shift 2, stretch 0
 * 6:15 pm -> shift 2, stretch 1
 * 6:30 pm -> shift 2, stretch 2
 * 6:45 pm -> shift 2, stretch 3
 * 7:00 pm -> shift 2, stretch 4
 */

// The daytime scene darkness level
const DAY_SCENE_DARKNESS = 0.0

// The nightime scene darkness level
const NIGHT_SCENE_DARKNESS = 1.0

// Milliseconds to animate lighting transitions
const ANIMATE_DARKNESS_MS = 5000

console.assert(NIGHT_SCENE_DARKNESS >= DAY_SCENE_DARKNESS)
console.assert(NIGHT_SCENE_DARKNESS <= 1.0)
console.assert(DAY_SCENE_DARKNESS >= 0.0)

function scaleDarknessVector (scale) {
    let darkness =
        scale * (NIGHT_SCENE_DARKNESS - DAY_SCENE_DARKNESS) + DAY_SCENE_DARKNESS
    darkness = Math.min(1, Math.max(0, darkness))
    return darkness
}

async function setSceneDarkness (darkness, animate = ANIMATE_DARKNESS_MS) {
    await canvas.scene.update(
        { 'environment.darknessLevel': darkness },
        { animateDarkness: animate }
    )
}

/**
 * While I love the interpolation idea I came up with, it breaks when an hour clock is present, since the pattern of stretches and shifts is different.
 */

if (scope.time.shift === 0 || scope.time.shift === 1) {
    // Is it dawn?
    if (
        scope.time.shift === 0 &&
        scope.time.stretch >= 0 &&
        scope.time.stretch <= 4
    ) {
        // interpolate the darkness value based on the current stretch
        const darknessScaling = (4 - scope.time.stretch) / 5
        const darkness = scaleDarknessVector(darknessScaling)
        console.log('Dawn darkness: %f', darkness)
        await setSceneDarkness(darkness)
    } else if (canvas.scene.environment.darknessLevel != DAY_SCENE_DARKNESS) {
        // we need to ensure that the current scene darkness level matches the day setting
        // since large time jumps can easily skip the dawn or dusk transitions
        await setSceneDarkness(DAY_SCENE_DARKNESS)
    }
} else if (scope.time.shift === 2 || scope.time.shift === 3) {
    // Is it sunset?
    if (
        scope.time.shift === 2 &&
        scope.time.stretch >= 0 &&
        scope.time.stretch <= 4
    ) {
        // interpolate the darkness value based on the current stretch
        const darknessScaling = (scope.time.stretch + 1) / 5
        const darkness = scaleDarknessVector(darknessScaling)
        console.log('Sunset darkness: %f', darkness)
        await setSceneDarkness(darkness)
    } else if (canvas.scene.environment.darknessLevel != NIGHT_SCENE_DARKNESS) {
        // we need to ensure that the current scene darkness level matches the night setting
        // since large time jumps can easily skip the dawn or dusk transitions
        await setSceneDarkness(NIGHT_SCENE_DARKNESS)
    }
}
