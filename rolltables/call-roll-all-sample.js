/*
Example macro for calling the roll-all-in-folder macro.
Be sure to replace the value of folderUuid with the actual UUID of the top-level
folder containing the roll tables you want to use.

Foundry v13
Version 1.1
*/
const macro = game.macros.getName('roll-all-in-folder')
await macro.execute({
    folderUuid: 'Folder.cyPH6EMn0DUlkdG8', // set to the UUID of the top-level folder containing your roll tables
    recursive: true, // control whether to search recursively for tables or not
    heading: false, // show the folder name as a heading
})
