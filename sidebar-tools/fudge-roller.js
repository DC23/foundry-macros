/*
A macro for the Foundry virtual tabletop that allows the GM to fudge a Roll Table result

Foundry v12
Version 1.0
*/

// Set this to the UUID of a table if you roll on a table a lot, 
// or want to customise different copies of this macro for different tables
// The UUID will be in the form RollTable.AUOdQK5u5tTlE3zN
const DEFAULT_ROLL_TABLE = ''

const { NumberField, DocumentUUIDField } = foundry.data.fields
const { DialogV2 } = foundry.applications.api

const forcedResultField = new NumberField({
    label: 'Forced Result',
    min: 1,
}).toFormGroup({}, { name: 'forcedResult' }).outerHTML

const uuidField = new DocumentUUIDField({
    label: 'Roll Table',
}).toFormGroup(
    {},
    { name: 'uuid', value: DEFAULT_ROLL_TABLE }
).outerHTML

// now make the dialog with the above fields.
const data = await DialogV2.prompt({
    window: { title: 'Fake the Roll Table Result' },
    position: { width: 400 },
    content: uuidField + forcedResultField,
    rejectClose: false,
    ok: {
        callback: (event, button) => new FormDataExtended(button.form).object,
    },
})

// Handle the rolling
if (data?.uuid) {
    const rollTable = await fromUuid(data.uuid)
    if (rollTable) {
        if (!(rollTable instanceof RollTable))
            return ui.notifications.warn('Wrong document type provided. A RollTable was expected.')

        // now force the result
        await rollTable.draw({ roll: new Roll(`${data.forcedResult}`) })
    }
}
