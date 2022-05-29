import React from "react";
import handleDelete from "./handleDelete";
import AsyncFS from "../../../utils/AsyncFS";
import FileSystem from "../../../utils/files/FileSystem";

export default function getDirectoryOptions(props) {

    return [
        {
            requiredTrigger: 'data-node',
            label: 'Delete',
            icon: <span className={'material-icons-round'}>delete</span>,
            onClick: (node) => handleDelete(node.getAttribute('data-node'), props.hook, props.bookmarksHook)
        },
        {
            requiredTrigger: 'data-node',
            label: 'Rename',
            icon: <span className={'material-icons-round'}>edit</span>,
            onClick: (node) => {
                const target = document.getElementById(node.getAttribute('data-node'))

                if (target) {
                    const event = new MouseEvent('dblclick', {
                        'view': window,
                        'bubbles': true,
                        'cancelable': true
                    });
                    target.dispatchEvent(event);
                }
            }
        },
        {
            requiredTrigger: 'data-self',
            label: 'New sub-folder',
            icon: <span className={'material-icons-round'}>create_new_folder</span>,
            onClick: () => onCreate('', props.hook).catch()
        },
        {
            requiredTrigger: 'data-node',
            label: 'New sub-folder',
            icon: <span className={'material-icons-round'}>create_new_folder</span>,
            onClick: (node) => onCreate(node.getAttribute('data-node'), props.hook).catch()
        },
        {
            requiredTrigger: 'data-root',
            label: 'New sub-folder',
            icon: <span className={'material-icons-round'}>create_new_folder</span>,
            onClick: () => onCreate('', props.hook).catch()
        }
    ]
}

export async function onCreate(parent, hook) {
    const directories = await hook.fileSystem.foldersFromDirectory(hook.path + parent)

    const getName = async (id) => {
        const index = directories.filter(d => {
            return d.split(FileSystem.sep )[d.split(FileSystem.sep).length - 1].includes('New folder')
        }).length
        let newID = id
        if (index > 0)
            newID += ' - ' + index

        while ((await AsyncFS.exists(hook.path + newID))) {
            newID = await getName(newID)
        }
        return newID
    }

    let id = getName(parent + FileSystem.sep + 'New folder')
    const [e] = await AsyncFS.mkdir(hook.path + id)
    if (!e)
        hook.refreshFiles()
}