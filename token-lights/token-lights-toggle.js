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

// Build a set of all the lighting options that will be shown in the UI
const states = new Set(Object.keys(LIGHTS))

/**
 * remove the no-lights option. We need the options for it,
 * but don't want it in the set of states used to build the UI
 */
states.delete('noLight')

// toggle the light. If the token has a light already, then turn it off
// TODO: iterate all selected tokens
const state = token.document.flags.world?.light ?? null
if (states.has(state))
    return token.document.update({
        light: LIGHTS.noLight,
        'flags.world.light': null,
    })

// otherwise, show the dialog so the user can choose a new light effect
// TODO: handle the exception when the dialog is closed without a choice being made.
return foundry.applications.api.DialogV2.wait({
    window: { title: 'Light Config' },
    position: { width: 400 },
    render: (event, html) =>
        html.querySelector('.form-footer').classList.add('flexcol'),
    buttons: Array.from(states).map(k => {
        return {
            label: k,
            // label: CONFIG.Canvas.lightAnimations[k]?.label || k,   * I don't really want the button labels tied to the animation names
            callback: callback,
            action: k,
        }
    }),
})

/**
 * @param {Object} event the button click event
 * @param {*} button the button that triggered the event.
 * @returns
 */
async function callback (event, button) {
    // Retrieve the required light properties
    const state = button.dataset.action
    const light = LIGHTS[state]
    console.log(
        'Token: %s, state: %O, light: %O',
        token.document.name,
        state,
        light
    )
    // Then update the token lighting and store the light in a flag
    // TODO: iterate all selected tokens
    return token.document.update({ light: light, 'flags.world.light': state })
}
