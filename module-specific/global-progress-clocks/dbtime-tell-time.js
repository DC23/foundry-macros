/*
A macro for the Foundry virtual tabletop.

Part of the Dragonbane Time collection.
Tells the current time to chat without changing the time.

Foundry v12
Version 1.0
*/

const macro = game.macros.getName('dbtime-engine')
await macro.execute({ mode: 'tell', includeDay: true })
