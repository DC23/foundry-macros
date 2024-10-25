/*
A macro for the Foundry virtual tabletop.

Part of the Dragonbane Time collection.

This macro is called when the time has changed.
Unlike the stretch, hour, shift, and day change macros which are only called when those particular 
clocks have changed, this script is always called when the time is changed in any way.

Foundry v12
Version 1.8
*/

//----------------------------------------------------------------------

/**
 * This code will execute whenever the time changes to an even hour, even if you don't have the optional Hour clock
 * enabled, while anything placed into dbtime-hour-change is only called when the Hour clock
 * is in use.
 */
if (scope.time.stretch % scope.constants.STRETCHES_PER_HOUR === 0) {
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
 * An example of how DB Time can be used to drive more complex automations.
 * Just delete this whole section if you don't want to automatically change scene
 * lighting based on the time of day.
 *
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

// totalStretches % STRETCHES_PER_DAY gives a consistent time of day
// regardless of the use of the hours clock.
const dailyStretch =
    scope.time.totalStretches % scope.constants.STRETCHES_PER_DAY

// Shifts 0 and 1 are the day shifts
if (scope.time.shift === 0 || scope.time.shift === 1) {
    // Dawn (6:00 to 7:00) is from stretch 0 to 4
    if (dailyStretch >= 0 && dailyStretch <= 4) {
        // interpolate the darkness value based on the current stretch
        const darknessScaling = (4 - dailyStretch) / 5
        const darkness = scaleDarknessVector(darknessScaling)
        console.log('Dawn darkness: %f', darkness)
        await setSceneDarkness(darkness)
    } else if (canvas.scene.environment.darknessLevel != DAY_SCENE_DARKNESS) {
        // we need to ensure that the current scene darkness level matches the day setting
        // since large time jumps can easily skip the dawn or dusk transitions
        console.log('Setting scene to day lighting: %f', DAY_SCENE_DARKNESS)
        await setSceneDarkness(DAY_SCENE_DARKNESS)
    }
}
// Shifts 2 and 3 are the night shifts
else if (scope.time.shift === 2 || scope.time.shift === 3) {
    // Dusk (18:00 to 19:00) is from stretch 48 to 52
    if (dailyStretch >= 48 && dailyStretch <= 52) {
        // interpolate the darkness value based on the current stretch
        // I'm actually subtracting 48 to get back to a range of 0 to 4, then adding 1 and dividing by 5
        const darknessScaling = (dailyStretch - 47) / 5
        const darkness = scaleDarknessVector(darknessScaling)
        console.log('Sunset darkness: %f', darkness)
        await setSceneDarkness(darkness)
    } else if (canvas.scene.environment.darknessLevel != NIGHT_SCENE_DARKNESS) {
        // we need to ensure that the current scene darkness level matches the night setting
        // since large time jumps can easily skip the dawn or dusk transitions
        console.log('Setting scene to night lighting: %f', NIGHT_SCENE_DARKNESS)
        await setSceneDarkness(NIGHT_SCENE_DARKNESS)
    }
}
