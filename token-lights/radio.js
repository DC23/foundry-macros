// This is the Foundry DialogV2 sample with radio buttons.
// I'm going to morph it into a form that suits the token lighting selector,
// then graft it to the code.

new foundry.applications.api.DialogV2({
  window: { title: 'Set Token Lighting' },
  position: { width: 500 },
  content: `
    <label><input type="radio" name="choice" value="none" checked>No lights</label>
    <label><input type="radio" name="choice" value="torch">Torch</label>
    <label><input type="radio" name="choice" value="lantern">Lantern or Oil Lamp</label>
    <label><input type="radio" name="choice" value="candle">Tallow Candle</label>
    <label><input type="radio" name="choice" value="magical">Magical Light</label>
  `,
  buttons: [
    {
      action: 'choice',
      label: 'Apply Lights',
      default: true,
      callback: (event, button, dialog) => button.form.elements.choice.value
    }
  ],
  submit: result => {
    ui.notifications.notify(`User picked option: ${result}`)
  }
}).render({ force: true })
