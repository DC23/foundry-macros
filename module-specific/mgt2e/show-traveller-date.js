/*
Displays the current time and date to chat formatted as a Traveller time and date.

Assumes that the Easy Timekeeping Weekday Settings are already set to:
- 7 days per week
- Days named: Oneday, Twoday, Threeday, Fourday, Fiveday, Sixday, Sevenday 
as described on page 114 of Mg2e Traveller Companion page 114 where the conventions for the reckoning of time are described.

Requires: 
 * Mongoose Traveller 2e system 0.11.10+
 * Easy Timekeeping module v1.2.1+

Foundry v12
Version 1.1
*/

const YEAR_ZERO = 1105       // In-game year corresponding to Easy Timekeeping year zero
const DAYS_PER_YEAR = 365    // Days per year

// I don't currently use this more than once, but I did earlier, and could again...
function toTravellerDate(day, year) {
    return `${day.toString().padStart(3, '0')}-${year}`
}

// Test for pulling values from the MgT2e system settings
//console.log("MgT2e Date: %s", toTravellerDate(game.settings.get('mgt2e', 'currentDay'), game.settings.get('mgt2e', 'currentYear')))

const timeFormatted = game.modules.get('jd-easytimekeeping').api.toTimeString()
const time = game.modules.get('jd-easytimekeeping').api.getTime()
const year = Math.floor(time.days / DAYS_PER_YEAR) + YEAR_ZERO
let day = time.days % DAYS_PER_YEAR
let week = Math.floor(day / 7)

// once the calculations are done, we can convert from 0-based to 1-based values for display
week += 1
day  += 1

let chatContent = `${timeFormatted}, ${time.day.name} Week ${week}<br/><b>Date:</b> ${toTravellerDate(day, year)}`
let chatData = {
    speaker: { actor:  canvas.tokens.controlled[0] ? canvas.tokens.controlled[0].actor : game.user.id },
    content: chatContent,
}

ChatMessage.create(chatData)
ui.notifications.notify(chatContent)