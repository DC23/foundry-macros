/*
Easy Timekeeping time changed handler for MgT2e game system.

- Todo: Keeps the MgT2e current day and year updated to the Easy Timekeeping year and day
- Updates jump progress

Requires: 
 - Mongoose Traveller 2e system 0.11.10+
 - Easy Timekeeping module v1.2.1+

Foundry v12
Version 1.4
*/

// If the day has changed, then make updates to the Traveller system day and year settings
if (time.days != oldTime.days) {
    //console.log("MgT2e Date: %s", toTravellerDate(game.settings.get('mgt2e', 'currentDay'), game.settings.get('mgt2e', 'currentYear')))
}

const jumpEndTime = game.user.getFlag('world', 'ravens-call-current-jump-end')
if (jumpEndTime) {
    /* only send an automatic Jump progress message if more than a day has elapsed 
       or if less than 1 day remains to the end of the jump
       or if time has moved past the end time of the jump
    */
    if (
        time.days != oldTime.days ||
        jumpEndTime.totalMinutes - time.totalMinutes < 60 * 24
    ) {
        const macro = game.macros.getName('show-jump-progress')
        const jumpEndDate = await macro.execute({ time: time })
    }
}
