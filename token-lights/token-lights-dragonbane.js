/*
A macro for the Foundry virtual tabletop.
Runs a dialog with token lighting options specific to the Dragonbane system.

Foundry v12
Version 2.4
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
const BRIGHT_CANDLE_RADIUS = 2 * GAME_MULTIPLIER_PER_SQUARE
const DIM_CANDLE_RADIUS = 2.5 * GAME_MULTIPLIER_PER_SQUARE

//--------------------------------------------------------------------------------
// The Form
//--------------------------------------------------------------------------------
const { BooleanField, NumberField, StringField } = foundry.data.fields
const { DialogV2 } = foundry.applications.api

// TODO: check if tokens are selected
if (canvas.tokens.controlled.length > 0) {
  // Build the fields for the dialog
  const lightSourceField = new StringField({
    label: 'Light Source:',
    required: true,
    initial: 'none',
    choices: {
      none: 'No lights',
      torch: 'Torch',
      lantern: 'Lantern or Oil Lamp',
      candle: 'Tallow Candle',
      magical: 'Magical Light'
    }
  }).toFormGroup({}, { name: 'lightSource' }).outerHTML

  const subtleAnimationsField = new BooleanField({
    label: 'Subtle Animations:'
  }).toFormGroup(
    { rootId: 'subtle-animations-check' },
    { name: 'subtleAnimations', value: true }
  ).outerHTML

  // now make the dialog with the above fields.
  const theDialog = await DialogV2.prompt({
    window: { title: 'Set Token Lighting' },
    position: { width: 500 },
    content: lightSourceField + subtleAnimationsField,
    ok: {
      callback: (event, button) => new FormDataExtended(button.form).object
    }
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
          0.3 // light color
        )
        break
    }
  }
} else {
  ui.notifications.warn('No tokens selected')
}

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
        intensity: animationIntensity
      }
    }
  })
}

function noLight (token) {
  token.document.update({
    light: {
      dim: 0,
      bright: 0,
      luminosity: 0.5,
      animation: { type: 'none' }
    }
  })
}
