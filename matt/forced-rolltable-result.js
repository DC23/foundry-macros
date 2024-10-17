/* 
A script macro that rolls a fixed entry from a specified roll table and displays the result to chat.
It expects two arguments:
  args[0]: The RollTable UUID in the form 'RollTable.UUID'
  args[1]: The entry to draw

Intended to be called from a Run Macro action on a MATT tile, so that the tile can trigger pre-defined
table results on demand.

Foundry v11, v12
Version 1.0
*/

const table = await fromUuid(args[0]);
if (args[1] >= 1 && args[1] <= table.results.size) {
  await table.draw({roll: new Roll(args[1].toString())});
}