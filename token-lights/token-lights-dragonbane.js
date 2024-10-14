/*
A macro for the Foundry virtual tabletop.
Runs a dialog with token lighting options specific to the Dragonbane system.

Foundry v12
Version 2.0
*/

// Some constants that I use across multiple lighting types
const COLOR_FIRE = '#a88115'
const COLOR_WHITE = '#ffffff'
const COLOR_MOON_GLOW = '#f4f1c9'
const BRIGHT_LIGHT_GRID_SQUARES = 5
const DIM_LIGHT_GRID_SQUARES = 6

// Dragonbane uses 2 meters per grid square. For other games this will often be set to 5
const GAME_MULTIPLIER_PER_SQUARE = 2

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
      magical: 'Magical Light',
      darkness: 'Darkness'
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
        torchLighting(token, animationType, animationIntensity, 5)
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
          GAME_MULTIPLIER_PER_SQUARE * 3,
          GAME_MULTIPLIER_PER_SQUARE * 2.5
        )
        break

      case 'magical':
        torchLighting(
          token,
          'fog', // animation type
          1, // animation intensity
          3, // animation speed
          GAME_MULTIPLIER_PER_SQUARE * DIM_LIGHT_GRID_SQUARES, // dim radius
          GAME_MULTIPLIER_PER_SQUARE * BRIGHT_LIGHT_GRID_SQUARES, // bright radius
          COLOR_MOON_GLOW, // light color
          0.3 // light color
        )
        break

      case 'darkness':
        noLight(token)
        darkness(token)
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
  dimRadius = GAME_MULTIPLIER_PER_SQUARE * DIM_LIGHT_GRID_SQUARES,
  brightRadius = GAME_MULTIPLIER_PER_SQUARE * BRIGHT_LIGHT_GRID_SQUARES,
  color = COLOR_FIRE,
  alpha = 0.4
) {
  token.document.update({
    light: {
      dim: dimRadius,
      bright: brightRadius,
      color: color,
      alpha: alpha,
      angle: 360,
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
      animation: { type: 'none' },
      negative: false
    }
  })
}

function darkness (token) {
  token.document.update({
    light: {
      color: '#000000',
      alpha: 0.1,
      dim: 0,
      bright: 0,
      luminosity: -0.5,
      dim: GAME_MULTIPLIER_PER_SQUARE * DIM_LIGHT_GRID_SQUARES,
      bright: GAME_MULTIPLIER_PER_SQUARE * BRIGHT_LIGHT_GRID_SQUARES,
      animation: { type: 'none' }
    }
  })
}
