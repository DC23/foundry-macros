/* 
A macro for the Foundry virtual tabletop that lets a user configure their token's lighting settings. 
Adapted for Dragonbane by JugglinDan from Sky Captain's foundry repo: https://github.com/Sky-Captain-13/foundry/blob/master/scriptMacros/tokenVision.js.

Primary changes are that I removed the vision settings since Dragonbane doesn't require them, and I reduced the light sources down to 
no light, candle, lantern, oil lamp, torch, and magical light.
The various lantern subtypes are not in the Dragonbane core rules, but I like them so I left them in. If they are useful, great.
Otherwise, they are easily ignored.

Foundry v11, v12
Version 1.5
*/

let applyChanges = false
new Dialog({
  title: `Token Lights`,
  content: `
    <form>
      <div class="form-group">
        <label>Light Source:</label>
        <select id="light-source" name="light-source">
          <option value="none">None</option>
          <option value="torch">Torch</option>
          <option value="candle">Candle</option>
          <option value="magical">Magical</option>
          <option value="lantern">Lantern</option>
          <option value="bullseye">Lantern (Bullseye)</option>
          <option value="hooded-dim">Lantern (Hooded - Dim)</option>
          <option value="hooded-half">Lantern (Hooded - Half)</option>
          <option value="hooded-bright">Lantern (Hooded - Bright)</option>
          <option value="darkness">Darkness</option>
          <option value="plain">Plain White Light</option>
        </select>
      </div>
      <div class="form-group">
        <label for="subtle-torches">Subtle Torches:</label>
        <input type="checkbox" name="subtle-torches" value="subtle-torches" id="subtle-torches" checked>
      </div>
    </form>
    `,
  buttons: {
    yes: {
      icon: "<i class='fas fa-check'></i>",
      label: `Apply Changes`,
      callback: () => (applyChanges = true)
    },
    no: {
      icon: "<i class='fas fa-times'></i>",
      label: `Cancel Changes`
    }
  },
  default: 'yes',
  close: html => {
    if (applyChanges) {
      for (let token of canvas.tokens.controlled) {
        // Get Light Options
        let lightSource = html.find('[name="light-source"]')[0].value || 'none'
        let dimLight = 12
        let brightLight = 10
        let lightAngle = 360
        let lockRotation = token.document.light.lockRotation
        let lightAnimation = token.document.light.animation
        let lightColor = token.document.light.color
        let animationType = 'flame'
        let animationIntensity = 1

        if ($('#subtle-torches').is(':checked')) {
          animationType = 'torch'
          animationIntensity = 2
        }

        // light preferences
        const animationSpeed = 3
        const colorFire = '#a88115'
        const colorWhite = '#ffffff'
        const colorMoonGlow = '#f4f1c9'
        let lightAlpha = 0.4
        let luminosity = 0.5

        switch (lightSource) {
          case 'none':
            dimLight = 0
            brightLight = 0
            lightAnimation = { type: 'none' }
            break
          case 'candle':
            dimLight = 4
            brightLight = 2
            lightAnimation = {
              type: animationType,
              speed: animationSpeed * 2,
              intensity: animationIntensity
            }
            lightColor = colorFire
            break
          case 'bullseye':
            lockRotation = false
            lightAngle = 53.13
            lightAnimation = {
              type: animationType,
              speed: animationSpeed,
              intensity: animationIntensity
            }
            lightColor = colorFire
            break
          case 'hooded-bright':
          case 'lantern':
            lightAnimation = {
              type: animationType,
              speed: animationSpeed,
              intensity: animationIntensity
            }
            lightColor = colorFire
            break
          case 'hooded-dim':
            dimLight = 3
            brightLight = 0.15
            lightAnimation = {
              type: animationType,
              speed: animationSpeed,
              intensity: animationIntensity
            }
            lightColor = colorFire
            break
          case 'hooded-half':
            dimLight = dimLight * 0.5
            brightLight = brightLight * 0.5
            lightAnimation = {
              type: animationType,
              speed: animationSpeed,
              intensity: animationIntensity
            }
            lightColor = colorFire
            break
          case 'plain':
            lightAnimation = { type: 'none' }
            lightColor = colorWhite
            lightAlpha = 0.25 // plain white looks better at lower alpha, otherwise it oversaturates
            break
          case 'darkness':
            lightAnimation = { type: 'none' }
            lightColor = '#000000'
            lightAlpha = 0.1
            luminosity = -0.5
            break
          case 'torch':
            lightAnimation = {
              type: animationType,
              speed: 5,
              intensity: animationIntensity
            }
            lightColor = colorFire
            break
          case 'magical':
            lightAnimation = { type: 'fog' }
            lightColor = colorMoonGlow
            lightAlpha = 0.3
            break
          default:
            dimLight = token.document.light.dim
            brightLight = token.document.light.bright
            lightAngle = token.document.light.angle
            lockRotation = token.document.light.lockRotation
            lightAnimation = token.document.light.animation
            lightAlpha = token.document.light.alpha
            lightColor = token.document.light.color
            luminosity = token.document.light.luminosity
        }

        // Update Token
        console.log(`${token.document.name}: Setting light to ${lightSource})`)
        token.document.update({
          light: {
            dim: dimLight,
            bright: brightLight,
            color: lightColor,
            alpha: lightAlpha,
            angle: lightAngle,
            animation: lightAnimation,
            luminosity: luminosity
          }
        })
      }
    }
  }
}).render(true)
