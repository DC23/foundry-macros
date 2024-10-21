/*
A macro for the Foundry virtual tabletop.

Ticks the Dragonbane Timekeeping clocks forward by N stretches.
You can duplicate this in Foundry to create macros that advance time
by 1 stretch, a shift (24 stretches), half a shift (12 stretches), or
whatever amount you want.

Foundry v12
Version 1.0
*/

const macro = game.macros.getName('gpc-dbtime')
await macro.execute({ mode: 'increment', count: 1 })
