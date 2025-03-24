/*
If a jump is in progress, calculates the remaining jump time and posts it to chat.
If the jump is complete, it clears the jump.

Foundry v12
Version 1.1
*/

function postChat (chatContent) {
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
}

const jumpEndTime = game.user.getFlag('world', 'ravens-call-current-jump-end')
if (jumpEndTime) {
    const time =
        typeof scope.time == 'undefined'
            ? game.modules.get('jd-easytimekeeping').api.getTime()
            : scope.time

    // Jump in progress: current time is earlier than jump end time
    if (time.totalMinutes < jumpEndTime.totalMinutes) {
        const jumpRemaining = game.modules
            .get('jd-easytimekeeping')
            .api.factorTime(jumpEndTime.totalMinutes - time.totalMinutes)
        const message = `<b>Jump in Progress</b><br/>Jump ends in ${
            jumpRemaining.days
        }d, ${jumpRemaining.hours
            .toString()
            .padStart(2, '0')}h, ${jumpRemaining.minutes
            .toString()
            .padStart(2, '0')}m`
        postChat(message)
    } else if (time.totalMinutes >= jumpEndTime.totalMinutes) {
        const message = `<b>Jump Completed!</b>`
        postChat(message)
        game.user.unsetFlag('world', 'ravens-call-current-jump-end')
    }
} else {
    postChat('<b>No jump in progress!</b>')
}
