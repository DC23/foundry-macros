/*
A macro for the Foundry virtual tabletop.

Ticks the Dragonbane Timekeeping clocks forward by 1 shift.

Foundry v12
Version 1.0
*/

const macro = game.macros.getName("gpc-dragonbane-time");
await macro.execute({mode:"shift", count: 1});
