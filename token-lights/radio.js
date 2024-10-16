// This is the Foundry DialogV2 sample with radio buttons.
// I'm going to morph it into a form that suits the token lighting selector,
// then graft it to the code.

if (canvas.tokens.controlled.length === 0) {
  ui.notifications.notify('No tokens selected')
  exit
}

// Since I'm now returning a promise from the dialog callback, I need to handle exceptions
// otherwise I get an uncaught exception if the dialog is dismissed without ok being clicked.
try {
  const { DialogV2 } = foundry.applications.api
  const who = canvas.tokens.controlled.length === 1 ? canvas.tokens.controlled[0].document.name : `${canvas.tokens.controlled.length} tokens`

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
          subtleAnimations: button.form.elements.subtleAnimations.checked
        })
      }
    }
  })

  // If execution gets here, the dialog exited successfully
  const lightSource = theDialog.lightSource
  const subtleAnimations = theDialog.subtleAnimations

  for (let token of canvas.tokens.controlled) {
    ui.notifications.notify(
      `${token.document.name}: Setting light to ${lightSource}, subtle: ${subtleAnimations}`
    )
  }
} catch (e) {}
