/*
A macro for the Foundry virtual tabletop.
Runs a dialog with token lighting options specific to the Dragonbane system.

Foundry v12
Version 2.0
*/

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
    position: { width: 400 },
    content: lightSourceField + subtleAnimationsField,
    ok: {
      callback: (event, button) => new FormDataExtended(button.form).object
    }
  })

  const lightSource = theDialog.lightSource

  for (let token of canvas.tokens.controlled) {
    ui.notifications.notify(
      `${token.document.name}: Setting light to ${lightSource}`
    )
    switch (lightSource) {
      default:
      case 'none':
        console.log('none')
        token.document.update({
          light: {
            dim: 0,
            bright: 0,
            animation: { type: 'none' },
            negative: false
          }
        })
        break

      case 'torch':
        console.log('torch')
        break

      case 'lantern':
        console.log('lantern')
        break

      case 'candle':
        console.log('candle')
        break

      case 'magical':
        console.log('magical')
        break

      case 'darkness':
        console.log('darkness')
        break
    }
  }
} else {
  ui.notifications.warn('No tokens selected')
}
