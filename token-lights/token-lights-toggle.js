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
 * Additionally, all the configuration options have been gathered together into a single
 * object at the top of the file. I'm not enough of a wizard to think of all this myself.
 * I owe a debt to the wizards at the Foundry Discord for the core idea that I'm building on.
 *
 * Foundry v12+
 * Version 1.0
 */

/**
 * Configure all your light options here.
 */

const COLOR_FIRE = '#a88115'
const COLOR_WHITE = '#ffffff'
const COLOR_MOON_GLOW = '#d4d4d4'

/**
 * Dragonbane uses 2 meters per grid square. For other games this will often be set to 5.
 * Simply adjust to match the units per grid square in your game and the lighting settings should
 * work out.
 * Value 2: bright light 10, dim light 12
 * Value 5: bright light 25, dim light 30
 * Value 6: bright light 30, dim light 36
 */
const GAME_MULTIPLIER_PER_SQUARE = 2

// These two are for the standard lights - torches, lanterns, magical lighting
const BRIGHT_LIGHT_RADIUS = 4 * GAME_MULTIPLIER_PER_SQUARE
const DIM_LIGHT_RADIUS = 5 * GAME_MULTIPLIER_PER_SQUARE

// These are for candles
const BRIGHT_CANDLE_RADIUS = 1.5 * GAME_MULTIPLIER_PER_SQUARE
const DIM_CANDLE_RADIUS = 2 * GAME_MULTIPLIER_PER_SQUARE

// TODO: add the list of animation types
// TODO: subtle animations
// TODO: animation intensity

/**
 * Be warned that if you ever add new options to this, the keys must be unique.
 * By this I mean the light names, such as 'Torch', 'Tallow Candle' etc.
 * This macro will explode if these names are not unique!
 */
const LIGHTS = {
    noLight: {
        dim: 0,
        bright: 0,
        angle: 360,
        luminosity: 0.5,
        alpha: 0.4,
        animation: { type: 'none' },
    },
    Torch: {
        dim: DIM_LIGHT_RADIUS,
        bright: BRIGHT_LIGHT_RADIUS * 0.9, // torches have a bright radius just a little smaller than lanterns
        color: COLOR_FIRE,
        angle: 360,
        luminosity: 0.5,
        alpha: 0.4,
        animation: { type: 'torch', speed: 5, intensity: 2 },
    },
    // not a Dragonbane thing, but I love the effect so much!
    'Bullseye Lantern': {
        dim: DIM_LIGHT_RADIUS * 1.4,
        bright: BRIGHT_LIGHT_RADIUS * 1.2,
        color: COLOR_FIRE,
        angle: 60,
        luminosity: 0.5,
        alpha: 0.4,
        animation: { type: 'torch' },
    },
    'Lantern / Oil Lamp': {
        dim: DIM_LIGHT_RADIUS,
        bright: BRIGHT_LIGHT_RADIUS,
        color: COLOR_FIRE,
        angle: 360,
        luminosity: 0.5,
        alpha: 0.4,
        animation: { type: 'torch', speed: 3, intensity: 2 },
    },
    'Tallow Candle': {
        dim: DIM_CANDLE_RADIUS,
        bright: BRIGHT_CANDLE_RADIUS,
        color: COLOR_FIRE,
        angle: 360,
        luminosity: 0.5,
        alpha: 0.4,
        animation: { type: 'torch', speed: 5, intensity: 4 },
    },
    'Light Trick': {
        dim: DIM_LIGHT_RADIUS,
        bright: BRIGHT_LIGHT_RADIUS,
        color: COLOR_MOON_GLOW,
        angle: 360,
        luminosity: 0.5,
        alpha: 0.3,
        animation: { type: 'fog', speed: 3, intensity: 4 },
    },
}

/**
 * You don't need to configure anything below here.
 */

// Build a Set of all the lighting options that will be shown in the UI.
// Helps ensure unique keys
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
    const subtleAnimations = new foundry.data.fields.BooleanField({
        label: 'Subtle Animations',
    }).toFormGroup(
        { rootId: 'subtle-animations' },
        { name: 'subtle-animations', value: true }
    ).outerHTML

    return foundry.applications.api.DialogV2.wait({
        window: { title: 'Light Config' },
        position: { width: 400 },
        rejectClose: false,
        render: (event, html) =>
            html.querySelector('.form-footer').classList.add('flexcol'),
        content: subtleAnimations,
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
    // TODO: do something with this
    const subtle = $('#subtleAnimations').is(":checked")
    const light = LIGHTS[state]
    // Then update the token lighting and store the light in a flag
    for (let token of unlitTokens) {
        token.document.update({ light: light, 'flags.world.light': state })
    }
}
