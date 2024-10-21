/* 
A script macro that rolls an on a roll table and displays the result to chat.
It accepts two arguments:
  args[0]: The RollTable UUID in the form 'RollTable.UUID'
  args[1]: Optional. If supplied, this forces the result to a specific entry.

Intended to be called from a Run Macro action on a MATT tile, so that the tile can trigger pre-defined
table results on demand.

Foundry v11, v12
Version 1.2
*/

const table = await fromUuid(args[0])

if (!(table instanceof RollTable))
  return ui.notifications.warn('This macro only accepts a RollTable UUID')

if (args.length > 1 && args[1] >= 1 && args[1] <= table.results.size) {
  await table.draw({ roll: new Roll(args[1].toString()) })
} else {
  await table.draw()
}
