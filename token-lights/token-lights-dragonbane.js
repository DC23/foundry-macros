/*
A macro for the Foundry virtual tabletop.
Runs a dialog with token lighting options specific to the Dragonbane system.

Foundry v12
Version 1.0
*/

const { BooleanField, NumberField, StringField } = foundry.data.fields
const { DialogV2 } = foundry.applications.api

// TODO: check if tokens are selected
if (canvas.tokens.controlled.length > 0) {
  // Build the fields for the dialog
  const lightSource = new StringField({
    label: 'Light Source:',
    blank: false
  }).toFormGroup({}, { name: 'lightSource' }).outerHTML

  const subtleAnimationsField = new BooleanField({
    label: 'Subtle Animations:'
  }).toFormGroup(
    { rootId: 'subtle-animations-check' },
    { name: 'subtleAnimations', value: true }
  ).outerHTML

  // now make the dialog with the above fields.
  const data = await DialogV2.prompt({
    window: { title: 'Set Token Lighting' },
    position: { width: 400 },
    content: lightSource + subtleAnimationsField,
    ok: {
      callback: (event, button) => new FormDataExtended(button.form).object
    }
  })
} else {
  ui.notifications.warn('No tokens selected')
}
