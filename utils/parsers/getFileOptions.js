import React from "react";
import {onCreate} from "../visuals/getDirectoryOptions";
import handleDelete from "../handleDelete";

export default function getFileOptions(hook, setCurrentItem) {
    return [
        {
            requiredTrigger: 'data-folder',
            label: 'Delete',
            icon: <span className={'material-icons-round'}>delete</span>,
            onClick: (node) => handleDelete(node.getAttribute('data-folder'), hook)
        },
        {
            requiredTrigger: 'data-folder',
            label: 'New sub-folder',
            icon: <span className={'material-icons-round'}>create_new_folder</span>,
            onClick: (node) => onCreate( node.getAttribute('data-folder') , hook)
        },
        {
            requiredTrigger: 'data-folder',
            label: 'Rename',
            icon: <span className={'material-icons-round'}>edit</span>,
            onClick: (node) => {
                setCurrentItem(node.getAttribute('data-folder'))
            }
        },
        {
            requiredTrigger: 'data-file',
            label: 'Rename',
            icon: <span className={'material-icons-round'}>edit</span>,
            onClick: (node) => {
                setCurrentItem(node.getAttribute('data-file'))
            }
        },
        {
            requiredTrigger: 'data-file',
            label: 'Delete',
            icon: <span className={'material-icons-round'}>delete</span>,
            onClick: (node) => handleDelete(node.getAttribute('data-file'), hook)

        },

        {
            requiredTrigger: 'data-folder-wrapper',
            label: 'New material',
            icon: <span className={'material-icons-round'}>texture</span>,
            onClick: () => {

                let path = hook.currentDirectory.id + '\\New material'
                if (hook.fileSystem.assetExists(path + '.material')) {
                    const existing = hook.fileSystem.fromDirectory(hook.path + hook.currentDirectory.id, '.material')

                    path += ' - ' + existing.filter(e => e.includes('New material')).length
                }

                hook.fileSystem.writeAsset(path + '.material', JSON.stringify({}))
                    .then(() => {
                        hook.refreshFiles()
                    })
            }
        },
        {
            requiredTrigger: 'data-folder-wrapper',
            label: 'New directory',
            icon: <span className={'material-icons-round'}>create_new_folder</span>,
            onClick: () => {
                let path = hook.currentDirectory.id + '\\New folder'

                const existing = hook.fileSystem.foldersFromDirectory(hook.path + hook.currentDirectory.id)
                if (existing.length > 0)
                    path += ' - ' + existing.length

                hook.fs.mkdir(hook.path + path, {}, () => {
                    hook.refreshFiles()
                })

            }
        },
    ]
}