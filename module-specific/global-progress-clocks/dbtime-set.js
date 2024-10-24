/*
A macro for the Foundry virtual tabletop.

Sets the Dragonbane Timekeeping clocks to the specified time.
Any of the named clocks can be omitted. 
Setting values on the optional clocks (hour, day) will be ignored if those
clocks are not in use.

Foundry v12
Version 1.1
*/

const macro = game.macros.getName('dbtime-engine')
await macro.execute({ mode: 'set', day: 1, shift: 1, stretch: 1, hour: 1 })
