/*
A macro for the Foundry virtual tabletop that duplicates the contents of a folder

Foundry v12
Version 1.0
*/

const { BooleanField, DocumentUUIDField } = foundry.data.fields
const { DialogV2 } = foundry.applications.api

// Define the dialog fields
const sourceField = new DocumentUUIDField({
  label: 'Source Folder:'
}).toFormGroup({}, { name: 'sourceUuid' }).outerHTML

const destinationField = new DocumentUUIDField({
  label: 'Destination Folder:'
}).toFormGroup({}, { name: 'destinationUuid' }).outerHTML

// run the dialog
const data = await DialogV2.prompt({
  window: { title: 'Duplicate Folder Contents' },
  position: { width: 400 },
  content: sourceField + destinationField,
  ok: {
    callback: (event, button) => new FormDataExtended(button.form).object
  }
})

const sourceFolder = await fromUuid(data.sourceUuid)
const destinationFolder = await fromUuid(data.destinationUuid)

if (!(sourceFolder instanceof Folder) || !(destinationFolder instanceof Folder))
  return ui.notifications.warn(
    'Wrong document type provided. Folders expected for source and destination.'
  )

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
  `Duplicated items from '${sourceFolder.name}' to '${destinationFolder.name}'`
)
