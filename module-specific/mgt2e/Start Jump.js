/*
Calculate the duration and end date and time of a Traveller jump using the current Easy Timekeeper time
and a random jump duration of 6d6+148 hours.
This macro does not change the time. It just displays the duration and end date and time to chat.

Requires: 
    - Mongoose Traveller 2e system 0.11.10+
    - Easy Timekeeping module v1.2.1+

Foundry v12
Version 1.8
*/

const jumpDurationHours = await new Roll('6d6+148').evaluate()
const jumpDurationMinutes = jumpDurationHours.total * 60
const now = game.modules.get('jd-easytimekeeping').api.getTime()
const jumpEndTime = now.totalMinutes + jumpDurationMinutes
const jumpEnd = game.modules
    .get('jd-easytimekeeping')
    .api.factorTime(jumpEndTime)
const jumpDuration = game.modules
    .get('jd-easytimekeeping')
    .api.factorTime(jumpDurationMinutes)
const macro = game.macros.getName('calc-traveller-date')
const jumpEndDate = await macro.execute({ time: jumpEnd })

function formatTravellerDate (day, year) {
    return `${day.toString().padStart(3, '0')}-${year}`
}

// Set the end time of the jump to the global flag so it can be checked in the time change handler macro
game.user.setFlag('world', 'mgt2e-jump-end-time', jumpEnd)

const chatContent = `The jump is calculated to complete in ${
    jumpDuration.days
} days, ${jumpDuration.hours} hours on <b>${formatTravellerDate(
    jumpEndDate.day,
    jumpEndDate.year
)}</b> at <b>${jumpEnd.hours.toString().padStart(2, '0')}:${jumpEnd.minutes
    .toString()
    .padStart(2, '0')}</b>`
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
