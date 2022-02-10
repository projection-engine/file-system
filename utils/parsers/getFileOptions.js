import React from "react";
import EVENTS from "../../../../pages/project/utils/misc/EVENTS";

export default function getFileOptions(hook, setCurrentItem){
    return [
        {
            requiredTrigger: 'data-folder',
            label: 'Delete',
            icon: <span className={'material-icons-round'}>delete</span>,
            onClick: (node) => {
                // TODO
            }
        },
        {
            requiredTrigger: 'data-folder',
            label: 'New sub-folder',
            icon: <span className={'material-icons-round'}>create_new_folder</span>,
            onClick: (node) => {
                const parent = hook.path + '/' + node.getAttribute('data-folder')
                const id = parent + '/New folder'
                const fs = window.require('fs')
                fs.mkdir(id, (e) => {

                    if (!e) {
                        hook.setItems(prev => {
                            return [...prev,
                                {
                                    id: id,
                                    name: 'New folder',
                                    isFolder: true,
                                    creationDate: new Date().toDateString(),
                                    parent
                                }]
                        })
                    }
                })
            }
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
            onClick: (node) =>{
                // TODO - ALERT IF ENTITY USES FILE. DELETE IF OK
                hook.load.pushEvent(EVENTS.DELETE_FILE)
                hook.fileSystem.deleteFile(node.getAttribute('data-file'), true)
                    .then((e) => {

                        hook.refreshFiles()
                        hook.load.finishEvent(EVENTS.DELETE_FILE)
                    })
            }
        },
        {
            requiredTrigger: 'data-folder-wrapper',
            label: 'New material',
            icon: <span className={'material-icons-round'}>public</span>,
            onClick: () => {
                const fs = window.require('fs')
                fs.writeFile(hook.currentDirectory.id + '\\New material.material', JSON.stringify({}), () => {
                    hook.refreshFiles()
                })
            }
        },

        {
            requiredTrigger: 'data-folder-wrapper',
            label: 'New directory',
            icon: <span className={'material-icons-round'}>create_new_folder</span>,
            onClick: () => {
                // TODO - CREATE FOLDER
            }
        },
    ]
}