import React from "react";
import {onCreate} from "../visuals/getDirectoryOptions";
import handleDelete from "../handleDelete";

export default function getFileOptions(hook, setCurrentItem, bookmarksHook) {
    const check = (path, ext) => {
        let n = path + ext
        let it = 0

        while (hook.fileSystem.assetExists(n)) {
            it++
            n = path + `(${it})` + ext
        }

        return n
    }
    return [
        {
            requiredTrigger: 'data-folder',
            label: 'Delete',
            icon: <span className={'material-icons-round'}>delete</span>,
            onClick: (node) => handleDelete(node.getAttribute('data-folder'), hook, bookmarksHook)
        },
        {
            requiredTrigger: 'data-folder',
            label: 'New sub-folder',
            icon: <span className={'material-icons-round'}>create_new_folder</span>,
            onClick: (node) => onCreate(node.getAttribute('data-folder'), hook)
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
            label: 'New Material',
            icon: <span className={'material-icons-round'}>texture</span>,
            onClick: () => {
                let path = check(hook.currentDirectory.id + '\\New Material', '.material')
                hook.fileSystem.writeAsset(path, JSON.stringify({}))
                    .then(() => {
                        hook.refreshFiles()
                    })
            }
        },
        {
            requiredTrigger: 'data-folder-wrapper',
            label: 'New Blueprint',
            icon: <span className={'material-icons-round'}>functions</span>,
            onClick: () => {
                let path = check(hook.currentDirectory.id + '\\New Blueprint', '.flow')

                hook.fileSystem.writeAsset(path , JSON.stringify({}))
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