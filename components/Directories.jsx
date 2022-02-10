import PropTypes from "prop-types";
import styles from '../styles/Directories.module.css'
import ContextMenu from "../../../components/context/ContextMenu";
import React, {useContext, useMemo} from "react";
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
                            fs.rm(props.hook.path + '\\' + id, {recursive: true, force: true}, (e) => {
                                load.finishEvent(EVENTS.DELETE_FOLDER)
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
                        onClick: () => {

                            let id = props.hook.path + '\\New folder'
                            const directories = props.hook.fileSystem.foldersFromDirectory(props.hook.fileSystem.path + '/assets')
                            const index = directories.filter(d => {
                                return d.split('\\')[d.split('\\').length - 1].includes('New folder')
                            }).length
                            if (index > 0)
                                id += ' - ' + index
                            fs.mkdir(id, (e) => {
                                if (!e) {
                                    props.hook.refreshFiles()
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

                            let id = parent + '\\New folder'
                            const directories = props.hook.fileSystem.foldersFromDirectory(props.hook.path + parent)
                            const index = directories.filter(d => {
                                return d.split('\\')[d.split('\\').length - 1].includes('New folder')
                            }).length
                            if (index > 0)
                                id += ' - ' + index
                            fs.mkdir(props.hook.path + id, (e) => {
                                if (!e)
                                    props.hook.refreshFiles()
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
                    onDrop={async (event, target) => {
                        const textData = event.dataTransfer.getData('text')
                        let from = textData
                        if (!from.includes('\\')) {

                            const reg = await props.hook.fileSystem.readRegistryFile(from)

                            if (reg)
                                from = reg.path
                            else {
                                props.setAlert({
                                    type: 'error',
                                    message: 'Could not find file.'
                                })
                                return
                            }

                        }
                        const to = target + '\\' + from.split('\\').pop()

                        const toItem = props.hook.items.find(f => f.id === target)
                        const fromItem = props.hook.items.find(f => {

                            return f.id === from || (f.registryID === textData && f.registryID !== undefined)
                        })
                        if (from !== to && toItem && toItem.id !== from && fromItem && fromItem.parent !== to && toItem.isFolder) {
                            props.hook.fileSystem
                                .rename(props.hook.path + '\\' +  from, props.hook.path + to)
                                .then(error => {
                                    if (from === props.hook.currentDirectory.id)
                                        props.hook.setCurrentDirectory(prev => {
                                            return {
                                                ...prev,
                                                id: to
                                            }
                                        })

                                    props.hook.refreshFiles()
                                })
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
                        const newNamePath = (folder.parent ? folder.parent + '\\' + newName : '\\' + newName)
                        props.hook.fileSystem
                            .rename(props.hook.path + folder.id, props.hook.path + newNamePath)
                            .then(error => {
                                if (folder.id === props.hook.currentDirectory.id)
                                    props.hook.setCurrentDirectory(prev => {
                                        return {
                                            ...prev,
                                            id: newNamePath
                                        }
                                    })
                                props.hook.refreshFiles()

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
