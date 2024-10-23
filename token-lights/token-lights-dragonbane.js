/*
A macro for the Foundry virtual tabletop.
Runs a dialog with token lighting options specific to the Dragonbane system.

Foundry v12
Version 3.0
*/

// Some constants that I use across multiple lighting types
// First, some colours
const COLOR_FIRE = '#a88115'
const COLOR_WHITE = '#ffffff'
const COLOR_MOON_GLOW = '#d4d4d4'

// Dragonbane uses 2 meters per grid square. For other games this will often be set to 5.
// Simply adjust to match the units per grid square in your game and the lighting settings should
// work out.
// Value 2: bright light 10, dim light 12
// Value 5: bright light 25, dim light 30
// Value 6: bright light 30, dim light 36
// You can use decimal values to fine tune, and you can also change the way the radii are calculated.
const GAME_MULTIPLIER_PER_SQUARE = 2

// These two are for the standard lights - torches, lanterns, magical lighting
const BRIGHT_LIGHT_RADIUS = 4 * GAME_MULTIPLIER_PER_SQUARE
const DIM_LIGHT_RADIUS = 5 * GAME_MULTIPLIER_PER_SQUARE

// These are for candles
const BRIGHT_CANDLE_RADIUS = 1.5 * GAME_MULTIPLIER_PER_SQUARE
const DIM_CANDLE_RADIUS = 2 * GAME_MULTIPLIER_PER_SQUARE

// Utility functions
// TODO: rewrite with objects to clean up calls
function torchLighting (
    token,
    animationType,
    animationIntensity,
    animationSpeed,
    dimRadius = DIM_LIGHT_RADIUS,
    brightRadius = BRIGHT_LIGHT_RADIUS,
    color = COLOR_FIRE,
    alpha = 0.4
) {
    token.document.update({
        light: {
            color: color,
            alpha: alpha,
            dim: dimRadius,
            bright: brightRadius,
            luminosity: 0.5,
            animation: {
                type: animationType,
                speed: animationSpeed,
                intensity: animationIntensity,
            },
        },
    })
}

function noLight (token) {
    token.document.update({
        light: {
            dim: 0,
            bright: 0,
            luminosity: 0.5,
            animation: { type: 'none' },
        },
    })
}

//--------------------------------------------------------------------------------
// The Form
//--------------------------------------------------------------------------------
if (canvas.tokens.controlled.length === 0) {
    ui.notifications.notify('No tokens selected')
    exit
}

// Since I'm now returning a promise from the dialog callback, I need to handle exceptions
// otherwise I get an uncaught exception if the dialog is dismissed without ok being clicked.
try {
    const { DialogV2 } = foundry.applications.api
    const who =
        canvas.tokens.controlled.length === 1
            ? canvas.tokens.controlled[0].document.name
            : `${canvas.tokens.controlled.length} tokens`

    const theDialog = await DialogV2.prompt({
        window: { title: `Set Lights: ${who}` },
        // position: { width: 500 },
        content: `
    <form>
      <div class="">
        <label style="display: block; margin-bottom: 5px;"><strong>Light Source:</strong></label>
        <label style="display: block; margin-bottom: 5px;"><input type="radio" name="choice" value="none" checked>No lights</label>
        <label style="display: block; margin-bottom: 5px;"><input type="radio" name="choice" value="torch">Torch</label>
        <label style="display: block; margin-bottom: 5px;"><input type="radio" name="choice" value="lantern">Lantern or Oil Lamp</label>
        <label style="display: block; margin-bottom: 5px;"><input type="radio" name="choice" value="candle">Tallow Candle</label>
        <label style="display: block; margin-bottom: 5px;"><input type="radio" name="choice" value="magical">Magical Light</label>
      </div>
      <div class="">
        <label for="subtleAnimations">Subtle Animations:</label>
        <input type="checkbox" name="subtleAnimations" value="subtleAnimations" id="subtleAnimations" checked>
      </div>
    </form>
  `,
        ok: {
            callback: (event, button, dialog) => {
                return Promise.resolve({
                    lightSource: button.form.elements.choice.value,
                    subtleAnimations:
                        button.form.elements.subtleAnimations.checked,
                })
            },
        },
    })

    //--------------------------------------------------------------------------------
    // The lighting
    //--------------------------------------------------------------------------------
    const lightSource = theDialog.lightSource
    const animationType = theDialog.subtleAnimations ? 'torch' : 'flame'
    const animationIntensity = theDialog.subtleAnimations ? 2 : 1

    for (let token of canvas.tokens.controlled) {
        ui.notifications.notify(
            `${token.document.name}: Setting light to ${lightSource}`
        )
        switch (lightSource) {
            default:
            case 'none':
                noLight(token)
                break

            case 'torch':
                torchLighting(
                    token,
                    animationType,
                    animationIntensity,
                    5,
                    DIM_LIGHT_RADIUS,
                    BRIGHT_LIGHT_RADIUS * 0.9
                )
                break

            case 'lantern':
                torchLighting(token, animationType, animationIntensity, 3)
                break

            case 'candle':
                torchLighting(
                    token,
                    animationType,
                    animationIntensity,
                    5,
                    DIM_CANDLE_RADIUS,
                    BRIGHT_CANDLE_RADIUS
                )
                break

            case 'magical':
                torchLighting(
                    token,
                    'fog', // animation type
                    animationIntensity, // animation intensity
                    3, // animation speed
                    DIM_LIGHT_RADIUS,
                    BRIGHT_LIGHT_RADIUS,
                    COLOR_MOON_GLOW, // light color
                    0.3 // alpha
                )
                break
        }
    }
} catch (e) {}
