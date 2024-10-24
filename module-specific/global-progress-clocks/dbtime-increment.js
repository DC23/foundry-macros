/*
A macro for the Foundry virtual tabletop.

Ticks the Dragonbane Timekeeping clocks forward by N stretches.
You can duplicate this in Foundry to create macros that advance time
by 1 stretch, a shift (24 stretches), half a shift (12 stretches), or
whatever amount you want.

You can use the examples provided here to create as many different macros 
in Foundry as you want. I mostly use ones for stretch, half and full shifts.

Foundry v12
Version 1.2
*/

const macro = game.macros.getName('dbtime-engine')

// 1 stretch
await macro.execute({ mode: 'increment', count: 1 })

// A shift
// await macro.execute({ mode: 'increment', count: 24 })

// An hour
// await macro.execute({ mode: 'increment', count: 4 })

/**
 * A half shift 
 * This is useful if the party takes a shift rest but you roll 
 * a random encounter and decide that the encounter takes place 
 * halfway through the shift
 */
// await macro.execute({ mode: 'increment', count: 12 })

// 2 shifts, which is a half day
// await macro.execute({ mode: 'increment', count: 48 })

// A full day
// await macro.execute({ mode: 'increment', count: 96 })