/*
A macro for the Foundry virtual tabletop that recursively sets items imported with 
Dynamic Item Builder with Traveller "D" notation to "D6".
For example: A weapon with damage "2D+4" will be converted to "2D6+4"

This macro also demonstrates a general pattern of:
- open a dialog to get a folder with an optional recursive flag
- build a list of all the items in the folder (the regex tests will need to be removed - they are specific to this task)
- map a change onto the list of items
- update everything in one efficient call

Tested on Foundry v13, though there's no reason it shouldn't work on newer releases

Version 1.0
*/

const { BooleanField, DocumentUUIDField } = foundry.data.fields
const { DialogV2 } = foundry.applications.api

// Build the fields for the dialog
const uuidField = new DocumentUUIDField({
    label: 'Folder',
}).toFormGroup({}, { name: 'uuid' }).outerHTML

const recursiveField = new BooleanField({
    label: 'Recursive',
}).toFormGroup(
    { rootId: 'world-ownership-recursive-check' },
    { name: 'recursive', value: true }
).outerHTML

const instructions = "<p>Drag the folder containing the items to update into the <b>Folder</b> box. Uncheck the recursive box if you don't want to update subfolders. Damage fields in Traveller notation will be updated to Foundry compatible notation.</p><p><b>EG:</b> '2D+3' → '2D6+3'</p><p>Items with the damage field already in Foundry format will not be changed.</p>"

// now make the dialog with the above fields.
const data = await DialogV2.prompt({
    window: { title: 'Traveller Dice Notation Fixer' },
    position: { width: 400 },
    content: `<div>${instructions}</div>` + uuidField + recursiveField,
    ok: {
        callback: (event, button) => new FormDataExtended(button.form).object,
    },
})

//-----------------------------------
// Update the damage entries
//-----------------------------------

// a regex to match the Traveller notation
const fixDice = str => str?.replace(/(\d+)([Dd])(?!6)/gi, '$1$26')

// For testing: this allows reverting to Traveller format. 
// Requires commenting out the idempotency filter when building docs 
//const unfixDice = str => str?.replace(/(\d+)[Dd]6/gi, '$1D')  

const mainFolder = await fromUuid(data.uuid)
if (!(mainFolder instanceof Folder))
    return ui.notifications.warn(
        'Wrong document type provided. A folder was expected.'
    )

// flatten all the folder contents into an array, filtering out items that are already correct
let docs = (data.recursive
    ? mainFolder.contents.concat(
          mainFolder.getSubfolders(true).flatMap(e => e.contents)
      )
    : mainFolder.contents
).filter(e => /(\d+)[Dd](?!6)/i.test(e.system.weapon.damage))

// change the damage strings into the collection of document updates
const updates = docs.map(e => ({
    _id: e.id,
    'system.weapon.damage': fixDice(e.system.weapon.damage),
}))

// update everything everywhere all at once
await mainFolder.documentClass.updateDocuments(updates)

// tell the user we're done
ui.notifications.notify(
    `${
        data.recursive ? 'Recursively updating' : 'Updating'
    } all items in folder '${mainFolder.name}'`
)