/*
If there is a jump in progress and the jump end time is in the future, then:
- set time to the end time of the jump
- clear the jump flag

Requires: 
    - Mongoose Traveller 2e system 0.11.10+
    - Easy Timekeeping module v1.2.1+

Foundry v12
Version 1.2
*/

async function wait (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const jumpEnd = game.user.getFlag('world', 'ravens-call-current-jump-end')
if (jumpEnd) {
    game.modules.get('jd-easytimekeeping').api.set(jumpEnd)

    // Wait 2 seconds for all the timekeeping updates, then post the new time to chat
    await wait(2000)
    await game.macros.getName('show-traveller-date').execute()
}
