/*
A macro for the Foundry virtual tabletop that sets permissions on all items in a folder
Foundry v12
Version 1.0
*/

const form = `
  <div style="display: inline-block; width: 100px; padding: 0.5em">Folder:</div>
  <input type="string" id="folderName">
  <br />

  <div style="display: inline-block; width: 100px; padding: 0.5em">All Players:</div>
  <select id="desiredPermission" />
    <option value="0">None</option>
    <option value="1">Limited</option>
    <option value="2">Observer</option>
    <option value="3">Owner</option>
  </select>
  <br />

  <span style="display: inline-block; padding: 0.5em">
      <label>
          <input type="checkbox" id="recurse" checked/>
          Recurse into subfolders
      </label>
  </span>
`

const dialog = new Dialog({
  title: 'Set Folder Permissions',
  content: form,
  buttons: {
    use: {
      label: 'Apply permissions',
      callback: applyPermissions
    }
  }
}).render(true)

async function applyPermissions (html) {
  const folderName = $('#folderName').val()
  const permissionText = $('#desiredPermission option:selected').text()
  const permission = $('#desiredPermission option:selected').val()
  const recursive = $('#recurse').is(':checked')

  const folders = game.folders.filter(f => f.name === folderName)
  if (folders.length === 0) {
    ui.notifications.error(`Folder not found: ${folderName}.`)
  } else if (folders.length > 1) {
    ui.notifications.error(
      `${folders.length} folders called '${folderName}' found. For now, give your folder a temporary unique name to use this script.`
    )
  } else {
    const folder_id = folders[0].id
    const mainFolder = game.folders.get(folder_id)
    const docs = recursive
      ? mainFolder.contents.concat(
          mainFolder.getSubfolders(true).flatMap(e => e.contents)
        )
      : mainFolder.contents
    const updates = docs.map(e => ({
      _id: e.id,
      '_id: ownership.default': permission
    }))
    await mainFolder.documentClass.updateDocuments(updates)
    console.log(docs)
    console.log(updates)
    ui.notifications.notify(
      `${
        recursive ? 'Recursively setting' : 'Setting'
      } folder '${folderName}' to ${permissionText} (${permission})`
    )
  }
}
