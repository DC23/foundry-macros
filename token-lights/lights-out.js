/* 
Simple macro for clearing lights from the selected tokens.

Foundry v11, v12
Version 1.0
*/
for (let token of canvas.tokens.controlled) {
    token.document.update({
        light: {
            dim: 0,
            bright: 0,
            animation: { type: 'none' },
            negative: false,
        },
    })
}
