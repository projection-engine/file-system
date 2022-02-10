import React from "react";
import EVENTS from "../../../../pages/project/utils/misc/EVENTS";

export default function getFileOptions(hook, setCurrentItem) {
    return [
        {
            requiredTrigger: 'data-folder',
            label: 'Delete',
            icon: <span className={'material-icons-round'}>delete</span>,
            onClick: (node) => {
                // TODO - CONFIRM MODAL IF HAS CHILDREN

                const id = node.getAttribute('data-folder')
                hook.load.pushEvent(EVENTS.DELETE_FOLDER)
                hook.fs.rm(hook.path + '\\' + id, {recursive: true, force: true}, (e) => {
                    hook.load.finishEvent(EVENTS.DELETE_FOLDER)
                    hook.refreshFiles()
                })
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
            onClick: (node) => {
                // TODO - ALERT IF ENTITY USES FILE. DELETE IF OK
                hook.load.pushEvent(EVENTS.DELETE_FILE)
                hook.fileSystem.deleteFile(hook.path + node.getAttribute('data-file'), true)
                    .then(() => {
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