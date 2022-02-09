import React from "react";

export default function getFileOptions(props, setCurrentItem){
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
                const parent = props.hook.path + '/' + node.getAttribute('data-folder')
                const id = parent + '/New folder'
                const fs = window.require('fs')
                fs.mkdir(id, (e) => {

                    if (!e) {
                        props.hook.setItems(prev => {
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
                // TODO - DELETE FILE
            }
        },
        {
            requiredTrigger: 'data-folder-wrapper',
            label: 'New material',
            icon: <span className={'material-icons-round'}>public</span>,
            onClick: () => {
                // TODO - CREATE MATERIAL
                // props.hook.pushFile(newFile, JSON.stringify({name: 'New MaterialView'}))
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