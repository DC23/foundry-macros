// This is the Foundry DialogV2 sample with radio buttons.
// I'm going to morph it into a form that suits the token lighting selector,
// then graft it to the code.

const { DialogV2 } = foundry.applications.api

// Since I'm now returning a promise from the dialog callback, I need to handle exceptions
// otherwise I get an uncaught exception if the dialog is dismissed without ok being clicked.
try {
  const theDialog = await DialogV2.prompt({
    window: { title: 'Set Token Lighting' },
    position: { width: 500 },
    content: `
    <label><input type="radio" name="choice" value="none" checked>No lights</label>
    <label><input type="radio" name="choice" value="torch">Torch</label>
    <label><input type="radio" name="choice" value="lantern">Lantern or Oil Lamp</label>
    <label><input type="radio" name="choice" value="candle">Tallow Candle</label>
    <label><input type="radio" name="choice" value="magical">Magical Light</label>
  `,
    ok: {
      callback: (event, button, dialog) => {
        return Promise.resolve({
          lightSource: button.form.elements.choice.value
        })
      }
    }
  })

  // If execution gets here, the dialog exited successfully
  const lightSource = theDialog.lightSource

  for (let token of canvas.tokens.controlled) {
    ui.notifications.notify(
      `${token.document.name}: Setting light to ${lightSource}`
    )
  }
} catch (e) {}
