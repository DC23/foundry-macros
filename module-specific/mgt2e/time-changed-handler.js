/*
Easy Timekeeping time changed handler for MgT2e game system.

- Todo: Keeps the MgT2e current day and year updated to the Easy Timekeeping year and day
- Todo: Calls the Show Traveller Date macro if more than 6 days have elapsed

Requires: 
 - Mongoose Traveller 2e system 0.11.10+
 - Easy Timekeeping module v1.2.1+

Foundry v12
Version 0.1
*/

// If the day has changed, then make updates to the Traveller system day and year settings
if (scope.time.days != scope.oldTime.days) {
    //console.log('Time Changed Handler: the day has changed. Was %s, Now %s', scope.oldTime.days, scope.time.days)
    //console.log("MgT2e Date: %s", toTravellerDate(game.settings.get('mgt2e', 'currentDay'), game.settings.get('mgt2e', 'currentYear')))
}