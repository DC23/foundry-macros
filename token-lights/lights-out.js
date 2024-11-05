/* 
Simple macro for clearing lights from the selected tokens.

Foundry v11, v12
Version 1.1
*/
for (let token of canvas.tokens.controlled) {
    token.document.update({
        light: {
            dim: 0,
            bright: 0,
            angle: 360,
            alpha: 0.5,
            luminosity: 0.5,
            animation: { type: 'none' },
            negative: false,
        },
    })
}
