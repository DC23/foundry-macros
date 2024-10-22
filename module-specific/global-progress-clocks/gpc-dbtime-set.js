/*
A macro for the Foundry virtual tabletop.

Sets the Dragonbane Timekeeping clocks to the specified time.
Any of the named clocks can be omitted. 

Foundry v12
Version 1.0
*/

const macro = game.macros.getName('gpc-dbtime')
await macro.execute({ mode: 'set', day: 1, shift: 1, stretch: 1, hour: 1 })
