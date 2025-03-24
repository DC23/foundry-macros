/*
Performs an instant jump, advancing time. 
This is useful if no gameplay is taking place
inside the ship during the jump itself.
Note that the flag used by the show-jump-progress
macro and related functionality is not set.

Foundry v12
Version 1.3
*/
let jumpDurationHours = await new Roll('6d6+148').evaluate()
console.log('Jump hours', jumpDurationHours.total)

game.modules
    .get('jd-easytimekeeping')
    .api.increment({ hours: jumpDurationHours.total })

const chatContent = `<b>Jump completed in ${jumpDurationHours.total} hours.</b>`
const chatData = {
    speaker: {
        actor: canvas.tokens.controlled[0]
            ? canvas.tokens.controlled[0].actor
            : game.user.id,
    },
    content: chatContent,
}

ChatMessage.create(chatData)
ui.notifications.notify(chatContent)
