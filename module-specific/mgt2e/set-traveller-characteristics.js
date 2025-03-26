/*
For some reason, I can't find a way to directly edit the characteristics on the character sheets.
But since I'm using alternate character creation methods from the Traveller Companion, I needed
to roll manually, then enter my values. This macro does just that. Enter the UUID for the character, 
then put the max values you rolled and run the macro once.

Mongoose Traveller 2e system 0.11.10+
Foundry v12+
Version 1.0
*/

let pc = game.actors.get('BktMo7Wt7bS3Ql6X') // Don't forget to delete the 'Actor.' prefix which Foundry adds when you copy the UUID from a character sheet.
console.log(pc.name)
console.log(pc.system.characteristics)

await pc.update({
    'system.characteristics.STR.value':  3,
    'system.characteristics.DEX.value': 11,
    'system.characteristics.END.value':  5,
    'system.characteristics.INT.value': 11,
    'system.characteristics.EDU.value': 10,
    'system.characteristics.SOC.value':  5,
    'system.characteristics.PSI.value':  0,
})