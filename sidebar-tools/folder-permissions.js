/*
A macro for the Foundry virtual tabletop that sets permissions on all items in a folder

Foundry v12
Version 2.1
*/

const { BooleanField, NumberField, DocumentUUIDField } = foundry.data.fields
const { DialogV2 } = foundry.applications.api

// need to clone the ownerships object as it is frozen to be able to remove INHERIT from it.
const levels = foundry.utils.deepClone(CONST.DOCUMENT_OWNERSHIP_LEVELS)
delete levels.INHERIT

// Build the fields for the dialog
const choices = Object.entries(levels).reduce((acc, [label, value]) => {
    acc.push({ value, label: label.toLowerCase().capitalize() })
    return acc
}, [])
const ownershipField = new NumberField({
    label: 'Ownership level',
    choices,
}).toFormGroup({}, { name: 'ownership' }).outerHTML

const uuidField = new DocumentUUIDField({
    label: 'Folder',
}).toFormGroup({}, { name: 'uuid' }).outerHTML

const recursiveField = new BooleanField({
    label: 'Recursive',
}).toFormGroup(
    { rootId: 'world-ownership-recursive-check' },
    { name: 'recursive', value: true }
).outerHTML

// now make the dialog with the above fields.
const data = await DialogV2.prompt({
    window: { title: 'Folder Ownership Management' },
    position: { width: 400 },
    content: ownershipField + uuidField + recursiveField,
    ok: {
        callback: (event, button) => new FormDataExtended(button.form).object,
    },
})

// Update the permissions

const mainFolder = await fromUuid(data.uuid)
if (!(mainFolder instanceof Folder))
    return ui.notifications.warn(
        'Wrong document type provided. A folder was expected.'
    )

// flatten all the folder contents into an array
const docs = data.recursive
    ? mainFolder.contents.concat(
          mainFolder.getSubfolders(true).flatMap(e => e.contents)
      )
    : mainFolder.contents

// build a list of updates for updateDocuments
const updates = docs.map(e => ({
    _id: e.id,
    'ownership.default': data.ownership,
}))

// update everything everywhere all at once
await mainFolder.documentClass.updateDocuments(updates)

// tell the user we're done
ui.notifications.notify(
    `${
        data.recursive ? 'Recursively setting' : 'Setting'
    } all items in folder '${mainFolder.name}' to ${
        choices[data.ownership].label
    }`
)
