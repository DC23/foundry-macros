/**
 * A macro for the Foundry virtual tabletop.
 *
 * Runs a dialog with token lighting options specific to the Dragonbane system.
 *
 * This is a new version of the macro that remembers the lights that have been set on a token,
 * and will toggle them automatically. Also, instead of the radio buttons in the last version,
 * in this one the choice is made with a single button click.
 * Hopefully these changes make this version even easier to use.
 *
 * Additionally, all the configuration options have been gathered together
 * at the top of the file.
 *
 * I owe a debt to the wizards at the Foundry Discord for the core ideas that I'm building on.
 *
 * Foundry v12+
 * Version 1.8
 */

/**
 * Configure light colours
 */
const COLOR_FIRE = '#a88115'
const COLOR_WHITE = '#ffffff'
const COLOR_MOON_GLOW = '#d4d4d4'

/**
 * Configure light radius here. The script reads the grid configuration from your scene,
 * and falls back to the hard coded value if required.
 *
 * Here's how the GAME_MULTIPLIER_PER_SQUARE values translate to light radii:
 *
 * Value 2: bright light 10 grid squares, dim light 12 grid squares
 * Value 5: bright light 25 grid squares, dim light 30 grid squares
 * Value 6: bright light 30 grid squares, dim light 36 grid squares
 *
 * I do apply a small fudge factor to the bright radius of torches,
 * to make them just a little less effective than lanterns.
 */
const GAME_MULTIPLIER_PER_SQUARE = canvas?.grid?.distance ?? 2

// changing these will change everything quite a lot
const BRIGHT_LIGHT_RADIUS = 5 * GAME_MULTIPLIER_PER_SQUARE
const DIM_LIGHT_RADIUS = 6 * GAME_MULTIPLIER_PER_SQUARE
const BRIGHT_CANDLE_RADIUS = 1.5 * GAME_MULTIPLIER_PER_SQUARE
const DIM_CANDLE_RADIUS = 2 * GAME_MULTIPLIER_PER_SQUARE

/**
 * This is the list of possible animations available for use in the `animation.type` field.
 * Note that by default I use 'torch' for torches and lanterns while I use 'flame' for candles.
 * This is a purely personal aesthetic choice. The older version of this Dragonbane lights macro
 * had a 'subtle torches' checkbox. Unchecking that used 'flame' for everything, which gives a
 * more exaggerated effect.
 *
 * The first value is the name you can use to configure the animation type,
 * the second value is the name you will see in the Foundry UI when configuring a light
 * there.
 *
 * This object is commented out because it's here for reference only,
 * it's not actually used in this macro.
 */
/*
const animations = {
    flame: 'Torch',
    torch: 'Flickering Light',
    revolving: 'Revolving Light',
    siren: 'Siren Light',
    pulse: 'Pulse',
    chroma: 'Chroma',
    wave: 'Pulsing Wave',
    fog: 'Swirling Fog',
    sunburst: 'Sunburst',
    dome: 'Light Dome',
    emanation: 'Mysterious Emanation',
    hexa: 'Hexa Dome',
    ghost: 'Ghostly Light',
    energy: 'Energy Field',
    vortex: 'Vortex',
    witchwave: 'Bewitching Wave',
    rainbowswirl: 'Swirling Rainbow',
    radialrainbow: 'Radial Rainbow',
    fairy: 'Fairy Light',
    grid: 'Force Grid',
    starlight: 'Star Light',
    smokepatch: 'Smoke Patch',
}
*/

/**
 * Be warned that if you ever add new options to this, the keys must be unique.
 * By this I mean the light names, such as 'Torch', 'Tallow Candle' etc.
 * This macro will explode if these names are not unique!
 */
const LIGHTS = {
    /**
     * You probably don't want to modify this one. It's used to turn the lights out.
     */
    noLight: {
        dim: 0,
        bright: 0,
        angle: 360,
        luminosity: 0.5,
        animation: { type: 'none' },
    },

    /**
     * The normal torch
     */
    'Torch': {
        dim: DIM_LIGHT_RADIUS,
        bright: BRIGHT_LIGHT_RADIUS * 0.9, // torches have a bright radius just a little smaller than lanterns
        color: COLOR_FIRE, // The light colour
        angle: 360,
        luminosity: 0.5, // The colour intensity. 0 is washed out, and 1 is intense.
        animation: { type: 'torch', speed: 5, intensity: 2 },
    },

    /**
     * The low-quality flickering torch
     * The difference is mostly the 'flame' versus the 'torch' animation
     */
    'Flickering Torch': {
        dim: DIM_LIGHT_RADIUS,
        bright: BRIGHT_LIGHT_RADIUS * 0.9, // torches have a bright radius just a little smaller than lanterns
        color: COLOR_FIRE,
        angle: 360,
        luminosity: 0.5,
        // Because 'flame' is a more intense animation effect, I reduce the animation speed
        animation: { type: 'flame', speed: 3, intensity: 2 },
    },

    /**
     * While lanterns and oil lamps have different mechanics and prices, they cast the same light
     */
    'Lantern / Oil Lamp': {
        dim: DIM_LIGHT_RADIUS,
        bright: BRIGHT_LIGHT_RADIUS,
        color: COLOR_FIRE,
        angle: 360,
        luminosity: 0.5,
        animation: { type: 'torch', speed: 3, intensity: 2 },
    },

    /**
     * Cheap, small radius, short burn time, flickers a lot
     */
    'Tallow Candle': {
        dim: DIM_CANDLE_RADIUS,
        bright: BRIGHT_CANDLE_RADIUS,
        color: COLOR_FIRE,
        angle: 360,
        luminosity: 0.5,
        animation: { type: 'flame', speed: 5, intensity: 4 },
    },

    /**
     * This is a good one for players to customise.
     * What does their Light spell look like?
     */
    'Light Magic Trick': {
        dim: DIM_LIGHT_RADIUS,
        bright: BRIGHT_LIGHT_RADIUS,
        color: COLOR_MOON_GLOW,
        angle: 360,
        luminosity: 0.5,
        animation: { type: 'dome', speed: 3, intensity: 6 },
    },

    /**
     * Not a Dragonbane light, but I love the effect so much!
     * You need to rotate the token to point the lantern.
     * Just delete or comment out this section if you don't want this light type in your game.
     */
    'Bullseye Lantern': {
        dim: DIM_LIGHT_RADIUS * 1.4,
        bright: BRIGHT_LIGHT_RADIUS * 1.2,
        color: COLOR_FIRE,
        angle: 60,
        luminosity: 0.5,
        animation: { type: 'torch', speed: 3, intensity: 2 },
    },
}

/************************************************************************/

/**
 * You don't need to configure anything below here.
 *
 * I mean, you can, but it's not required to modify the
 * lighting choices. That can be done entirely through
 * changing or adding colours and lights.
 */

/**
 * Build a Set of all the lighting options that will be shown in the UI.
 * Helps ensure unique keys
 */
const states = new Set(Object.keys(LIGHTS))

/**
 * remove the no-lights option. We need the options for it,
 * but don't want it in the set of states used to build the UI
 */
states.delete('noLight')

/**
 * Iterate all selected tokens.
 * If any have already had a light set, then clear it.
 * If any have no light, then add them to the array and bring up the UI
 */
let unlitTokens = []
for (let token of canvas.tokens.controlled) {
    const state = token.document.flags.world?.light ?? null
    if (states.has(state)) {
        // this token is lit, turn it off
        token.document.update({
            light: LIGHTS.noLight,
            'flags.world.light': null,
        })
    } else {
        // this token is unlit, add it to the array to process
        unlitTokens.push(token)
    }
}

// show the dialog so the user can choose a new light effect
if (unlitTokens.length) {
    const who =
        unlitTokens.length === 1
            ? unlitTokens[0].document.name
            : `${unlitTokens.length} tokens`
    return foundry.applications.api.DialogV2.wait({
        window: { title: `Set Lights: ${who}`, resizable: true, },
        position: { width: 360, height: 164, },
        rejectClose: false,
        render: (event, html) =>
            html.querySelector('.form-footer'),
        buttons: Array.from(states).map(k => {
            return {
                label: k,
                callback: setTokenLights,
                action: k, // just use the button label as a flag. We know the strings are unique since states is a Set
            }
        }),
    })
}

/**
 * @param {Object} event the button click event
 * @param {*} button the button that triggered the event.
 * @returns
 */
async function setTokenLights (event, button) {
    // Retrieve the required light properties
    const state = button.dataset.action
    const light = LIGHTS[state]
    // Then update the token lighting and store the light in a flag
    for (let token of unlitTokens) {
        token.document.update({ light: light, 'flags.world.light': state })
    }
}
