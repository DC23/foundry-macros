/*
Select a random token from the current selection and post to a chat message.
I use this when there is more than one obvious choice for a horrible fate and
I want to avoid any sign of favoritism.

Foundry v11, v12
Version 1.5
*/

function getRandomItem (arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

function formatChosen (chosen) {
    return `<b style="color:Red;">${chosen}</b>`
}

const messageTemplates = [
    'The Fates have chosen ... $$$',
    '$$$, your time is at hand',
    '$$$ draws the short straw',
    'The bones say $$$',
    'It is written in the stars that $$$ must pay the price',
    '$$$, prepare yourself!',
    'Cry havoc, and let slip the dogs of war! They come for $$$',
    '$$$, the bell tolls for thee!',
]

function getFateMessage (chosen) {
    /* Yes, I know this could be done with more elegant approaches, but honestly,
      I'm a Python programmer and string handling in JS is a complete mess to me.
      None of the few approaches I tried were any cleaner than just using a simple 
      substitution token in the message string.
      */
    return (message = getRandomItem(messageTemplates).replace(
        '$$$',
        formatChosen(chosen)
    ))
}

/* Roll a dice with the number of faces that matches the number of tokens. Astute readers
 will notice that this roll is not used to select a token. It's just so Dice So Nice will
 display something. We never actually say which number belongs to a token, but it adds to the
 effect!
*/
let roll = await new Roll(`1d${canvas.tokens.controlled.length}`).evaluate(
    (options = { async: true })
)

/* post the message as the person running the script, but with an alias. 
This helps chat formatting work correctly, and avoids the default behavior 
of posting as the first selected token.
*/
let chatData = {
    speaker: { actor: game.user.id, alias: 'The Dice Gods' },
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    rolls: [roll],
    content: getFateMessage(getRandomItem(canvas.tokens.controlled).name),
}

ChatMessage.applyRollMode(chatData, 'roll')
ChatMessage.create(chatData)
