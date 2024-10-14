/*
A macro for the Foundry virtual tabletop that duplicates the contents of a folder

Heavily based on the work of @bithir of the Dragonbane Discord.
https://discord.com/channels/1173874944430579733/1238171351559180368/1238171351559180368

Foundry v12
Version 2.1
*/

const { StringField, DocumentUUIDField } = foundry.data.fields
const { DialogV2 } = foundry.applications.api

// Define the dialog fields
const sourceField = new DocumentUUIDField({
  label: 'Source Folder:'
}).toFormGroup({}, { name: 'sourceUuid' }).outerHTML

const destinationField = new DocumentUUIDField({
  label: 'Destination Folder:'
}).toFormGroup({}, { name: 'destinationUuid' }).outerHTML

const prefixField = new StringField({
  label: 'Prefix:',
  hint: 'Leave blank for no prefix',
  blank: true,
  trim: false // allow leading or trailing whitespace
}).toFormGroup({}, { name: 'prefix' }).outerHTML

// run the dialog
const theDialog = await DialogV2.prompt({
  window: { title: 'Duplicate Folder Contents' },
  position: { width: 400 },
  content: sourceField + destinationField + prefixField,
  ok: {
    callback: (event, button) => new FormDataExtended(button.form).object
  }
})

const sourceFolder = await fromUuid(theDialog.sourceUuid)
const destinationFolder = await fromUuid(theDialog.destinationUuid)
const namePrefix = theDialog.prefix ? theDialog.prefix : ''

// Since the dialog allows dragging any document onto the DocumentUUIDFields, make sure we have folders
if (!(sourceFolder instanceof Folder) || !(destinationFolder instanceof Folder))
  return ui.notifications.warn(
    'Wrong document type provided. Folders expected for source and destination.'
  )

// Only allow copying from the same types of folders (i.e. actor to actor folder, item to item folder)
if (sourceFolder.type != destinationFolder.type) {
  return ui.notifications.warn(
    `Source '${sourceFolder.name}' and destination '${destinationFolder.name}' must be the same type`
  )
}

let folderCopy = sourceFolder.contents.map(data => {
  return {
    ...data.toObject(),
    name: `${namePrefix}${data.name}`,
    folder: destinationFolder.id,
    ownership: { default: data.ownership.default } // retain default ownership from source
  }
})

await destinationFolder.documentClass.createDocuments(folderCopy)

ui.notifications.notify(
  `Duplicated ${folderCopy.length} items from '${sourceFolder.name}' to '${destinationFolder.name}'`
)
