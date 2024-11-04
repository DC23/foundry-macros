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
const lightConfigs = {
    def: { dim: 0, bright: 0 },
    torch: {
        dim: 40,
        bright: 20,
        color: '#92bd51',
        animation: { type: 'torch' },
        angle: 360,
    },
    bullseye: {
        dim: 120,
        bright: 60,
        color: '#92bd51',
        animation: { type: 'torch' },
        angle: 60,
    },
    // candle
    // lantern
    // magical
}

// Build a set of all the lighting options that will be shown in the UI
const states = new Set(Object.keys(lightConfigs))

// remove the no-lights option. We need the options for it, but don't want it in the states set.
states.delete('def')

// toggle the light. If the token has a light set, then turn the lights off
const state = token.document.flags.world?.light ?? null
if (states.has(state))
    return token.document.update({
        light: lightConfigs.def,
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
            label: CONFIG.Canvas.lightAnimations[k]?.label || k,
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
    const light = lightConfigs[state]
    console.log(
        'Token: %s, state: %O, light: %O',
        token.document.name,
        state,
        light
    )
    // Then update the token lighting and store the light in a flag
    return token.document.update({ light: light, 'flags.world.light': state })
}
