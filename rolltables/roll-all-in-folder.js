/*
Selects a single result from all Roll Tables in a folder and posts the results to a
chat message. The chat message is formatted as follows:

- The message is posted with a user alias of the name of the top-level folder
- Each table name is used to prefix the result from that table

This allows the construction of folders containing roll tables that recreate multi-table
RPG tools such as the UNE NPC creator, the various Sine Nomine One-Roll tables and more.

This macro is not intended to be modified or used directly. It should be called 
from other macros, as follows:
const macro = game.macros.getName('roll-all-in-folder')
await macro.execute({ folderUuid: 'Folder.cyPH6EMn0DUlkdG8', recursive: false })

where the value of folderUuid is the top-level folder containing the roll tables that will be 
used to build the result.

If the recursive argument is true, then all roll tables in nested folders will be called.

Foundry v13
Version 1.1
*/

console.assert(
    typeof folderUuid != 'undefined',
    'folderUuid macro argument expected'
)
console.assert(
    typeof recursive != 'undefined',
    'recursive macro argument expected'
)

const folder = await fromUuid(folderUuid)
if (!(folder instanceof Folder))
    return ui.notifications.warn(
        'Wrong document type provided. A folder was expected.'
    )

// flatten all the folder contents into an array
const rollTables = recursive
    ? folder.contents.concat(
          folder
              .getSubfolders(true)
              .flatMap(e => e.contents)
              .filter(e => e instanceof RollTable)
      )
    : folder.contents.filter(e => e instanceof RollTable)

async function draw (r) {
    const result = await r.draw({ roll: true, displayChat: false })
    message = message.concat(
        `<br/><b>${r.name}:</b> ${result.results[0].description}`
    )
    console.log(message)
}

let results = []
rollTables.forEach(r => {
    results.push(r.draw({ roll: true, displayChat: false }))
})

// resolve all the promises
results = await Promise.all(results)

// build the chat message
let message = '' //`<h4>${folder.name}</h4>`
results.forEach(r => {
    message = message.concat(
        `<b>${r.results[0].parent.name}:</b> ${r.results[0].description}<br/>`
    )
})

// post the chat message
let chatData = {
    speaker: { actor: game.user.id, alias: folder.name },
    content: message,
}

ChatMessage.applyRollMode(chatData, 'roll')
ChatMessage.create(chatData)
