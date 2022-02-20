import EVENTS from "../../../../services/utils/misc/EVENTS";
import React from "react";

const fs = window.require('fs')
export default function getDirectoryOptions(props, load) {

    return [
        {
            requiredTrigger: 'data-folder',
            label: 'Delete',
            icon: <span className={'material-icons-round'}>delete</span>,
            onClick: (node) => {
                const id = node.getAttribute('data-folder')
                load.pushEvent(EVENTS.DELETE_FOLDER)
                fs.rm(props.hook.path + '\\' + id, {recursive: true, force: true}, (e) => {
                    load.finishEvent(EVENTS.DELETE_FOLDER)

                    if(props.hook.currentDirectory.id === id)
                        props.hook.setCurrentDirectory({
                            id: '\\'
                        })
                    props.hook.refreshFiles()
                })
            }
        },
        {
            requiredTrigger: 'data-folder',
            label: 'Rename',
            icon: <span className={'material-icons-round'}>edit</span>,
            onClick: (node) => {
                const target = document.getElementById(node.getAttribute('data-folder') + '-node')
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
            requiredTrigger: 'data-directories-wrapper',
            label: 'New folder',
            icon: <span className={'material-icons-round'}>create_new_folder</span>,
            onClick: () => onCreate('', props.hook)
        },
        {
            requiredTrigger: 'data-folder',
            label: 'New sub-folder',
            icon: <span className={'material-icons-round'}>create_new_folder</span>,
            onClick: (node) => onCreate(node.getAttribute('data-folder'), props.hook)
        },
        {
            requiredTrigger: 'data-root',
            label: 'New sub-folder',
            icon: <span className={'material-icons-round'}>create_new_folder</span>,
            onClick: () => onCreate('', props.hook)
        }
    ]
}

export function onCreate(parent, hook) {
    const directories = hook.fileSystem.foldersFromDirectory(hook.path + parent)

    const getName = (id) => {
        const index = directories.filter(d => {
            return d.split('\\')[d.split('\\').length - 1].includes('New folder')
        }).length
        let newID = id
        if (index > 0)
            newID += ' - ' + index

        while(fs.existsSync(hook.path + newID)){
            newID = getName(newID)
        }
        return newID
    }

    let id = getName(parent + '\\New folder')


    fs.mkdir(hook.path + id, (e) => {

        if (!e)
            hook.refreshFiles()
    })
}