/*
Displays the current time and date to chat formatted as a Traveller time and date.

Assumes that the Easy Timekeeping Weekday Settings are already set to:
    - 7 days per week
    - Days named: Oneday, Twoday, Threeday, Fourday, Fiveday, Sixday, Sevenday 
as described on page 114 of Mg2e Traveller Companion page 114 where the conventions for the reckoning of time are described.

Requires: 
    - Mongoose Traveller 2e system 0.11.10+
    - Easy Timekeeping module v1.2.1+

Foundry v12
Version 1.2
*/

// I don't currently use this more than once, but I did earlier, and could again...
function formatTravellerDate(day, year) {
    return `${day.toString().padStart(3, '0')}-${year}`
}

const etTime = game.modules.get('jd-easytimekeeping').api.getTime() // Easy Timekeeping time
const macro = game.macros.getName("calc-traveller-date")
const tTime = await macro.execute({'time': etTime})                 // Traveller time
const timeFormatted = game.modules.get('jd-easytimekeeping').api.toTimeString()

let chatContent = `${timeFormatted}, ${etTime.day.name} Week ${tTime.week}<br/><b>Date:</b> ${formatTravellerDate(tTime.day, tTime.year)}`
let chatData = {
    speaker: { actor:  canvas.tokens.controlled[0] ? canvas.tokens.controlled[0].actor : game.user.id },
    content: chatContent,
}

ChatMessage.create(chatData)
ui.notifications.notify(chatContent)