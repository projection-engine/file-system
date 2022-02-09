import PropTypes from "prop-types";
import styles from '../styles/Directories.module.css'
import ContextMenu from "../../../components/context/ContextMenu";
import React, {useContext, useMemo} from "react";
import Folder from "../templates/Folder";
import TreeView from "../../../components/tree/TreeView";
import mapToView from "../utils/parsers/mapToView";
import EVENTS from "../../../pages/project/utils/misc/EVENTS";
import LoadProvider from "../../../pages/project/hook/LoadProvider";

const fs = window.require('fs')
export default function Directories(props) {
    const directoriesToRender = useMemo(() => {
        const toFilter = props.hook.items.filter(item => item.isFolder && !item.parent)

        return toFilter.map(f => {
            return mapToView(f, props.hook)
        })
    }, [props.hook.items])
    const load = useContext(LoadProvider)
    return (
        <div data-directories-wrapper={'true'} className={styles.wrapper}>
            <ContextMenu
                options={[
                    {
                        requiredTrigger: 'data-folder',
                        label: 'Delete',
                        icon: <span className={'material-icons-round'}>delete</span>,
                        onClick: (node) => {
                            // TODO - CONFIRM MODAL IF HAS CHILDREN
                            const id = node.getAttribute('data-folder')
                            load.pushEvent(EVENTS.DELETE_FOLDER)
                            fs.rm(id, {recursive: true, force: true}, (e) => {
                                load.finishEvent(EVENTS.DELETE_FOLDER)
                                props.hook.setItems(prev => {
                                    return prev.filter(p => p.id !== id)
                                })
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
                        onClick: () => {
                            let id = props.hook.fileSystem.path + '/assets/New folder'
                            const directories = props.hook.fileSystem.foldersFromDirectory(props.hook.fileSystem.path + '/assets')
                            const index = directories.filter(d => {
                                return d.split('\\')[d.split('\\').length - 1].includes('New folder')
                            }).length
                            if (index > 0)
                                id += ' - ' + index
                            fs.mkdir(id, (e) => {
                                if (!e) {
                                    props.hook.setItems(prev => {
                                        return [...prev,
                                            {
                                                id: id,
                                                name: index > 0 ? 'New folder ' + ' - ' + index : 'New folder',
                                                isFolder: true,
                                                creationDate: new Date().toDateString(),
                                                parent: undefined
                                            }]
                                    })
                                }
                            })
                        }
                    },
                    {
                        requiredTrigger: 'data-folder',
                        label: 'New sub-folder',
                        icon: <span className={'material-icons-round'}>create_new_folder</span>,
                        onClick: (node) => {
                            const parent = node.getAttribute('data-folder')
                            let id = parent + '/New folder'
                            const directories = props.hook.fileSystem.foldersFromDirectory(parent)
                            const index = directories.filter(d => {
                                return d.split('\\')[d.split('\\').length - 1].includes('New folder')
                            }).length
                            if (index > 0)
                                id += ' - ' + index
                            fs.mkdir(id, (e) => {
                                if (!e) {
                                    props.hook.setItems(prev => {
                                        return [...prev,
                                            {
                                                id: id,
                                                name: index > 0 ? 'New folder ' + ' - ' + index : 'New folder',
                                                isFolder: true,
                                                creationDate: new Date().toDateString(),
                                                parent
                                            }]
                                    })
                                }
                            })
                        }
                    }
                ]}
                triggers={[
                    'data-directories-wrapper',
                    'data-folder'
                ]}>
                <TreeView
                    draggable={true}
                    onDrop={(event, target) => {
                        event.currentTarget.parentNode.classList.remove(styles.hovered)
                        const item = props.hook.items.find(f => f.id === target)
                        const dropTarget = props.hook.items.find(f => f.id === event.dataTransfer.getData('text'))
                        if (item && item.id !== event.dataTransfer.getData('text') && dropTarget && item.parent !== event.dataTransfer.getData('text') && item instanceof Folder) {
                            // if(dropTarget instanceof Folder)
                            // TODO - MOVE FOLDER
                            // props.hook.moveFolder(dropTarget.id, item.id)
                            // else
                            // TODO - MOVE FILE
                            // props.hook.moveFile(dropTarget.id, item.id)
                        }
                    }}
                    onDragLeave={(event, target) => {
                        event.preventDefault()
                        event.currentTarget.classList.remove(styles.hovered)
                    }}
                    onDragOver={(event, target) => {
                        event.preventDefault()
                        event.currentTarget.classList.add(styles.hovered)
                    }}


                    selected={props.hook.currentDirectory.id}
                    nodes={directoriesToRender}
                    handleRename={(folder, newName) => {
                        props.hook.fileSystem.rename(folder.id, (folder.parent ? (folder.parent + '/') : (props.hook.fileSystem.path + '/assets/')) + newName)
                            .then(error => {
                                console.log(error)
                            })
                    }}
                />
            </ContextMenu>
        </div>
    )
}

Directories.propTypes = {
    hook: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired
}
