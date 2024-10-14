/*
A macro for the Foundry virtual tabletop that duplicates the contents of a folder

Foundry v12
Version 1.0
*/

// Change this to the ID of the source folder you want to copy
// Folder id can be gained by left clicking the little icon in the header of the folder
let sourceFolder = game.folders.get('[CHANGE THIS - Source folder ID]')
// Change this to the ID of destination folder where the copies should end up in
// Folder id can be gained by left clicking the little icon in the header of the folder
let destFolder = game.folders.get('[CHANGE THIS - Destination folder')

// This will be prefixed to their name - put to empty string if you do not want a prefix
let namePrefix = 'New '

/*
// Only allow copying from the same types of folders (i.e. actor to actor folder, item to item folder)
if (sourceFolder.type != destFolder.type) {
  return ui.notifications.error(
    `Source folder[${sourceFolder.name}] and destingation folder[${destFolder.name}] needs to be same type`
  )
}
let folderCopy = sourceFolder.contents.map(data => {
  return {
    ...data.toObject(),
    name: `${namePrefix}${data.name}`,
    folder: destFolder.id,
    ownership: {}
  }
})

// Sadly, createDocuments can't be performed directly on Document, so we need to check what type of document there is
getDocumentClass(sourceFolder.type).createDocuments(folderCopy)
*/
ui.notifications.notify(
  `Duplicated items from '${sourceFolder}' to '${destFolder}`
)
