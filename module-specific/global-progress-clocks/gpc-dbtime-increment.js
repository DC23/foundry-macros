/*
A macro for the Foundry virtual tabletop.

Ticks the Dragonbane Timekeeping clocks forward by N stretches

Foundry v12
Version 1.0
*/

const macro = game.macros.getName('gpc-dragonbane-time')
await macro.execute({ mode: 'increment', count: 1 })
