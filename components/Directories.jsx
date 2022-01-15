import PropTypes from "prop-types";
import styles from '../styles/Directories.module.css'
import ContextMenu from "../../components/context/ContextMenu";
import React, {useEffect, useMemo} from "react";
import Folder from "../templates/Folder";
import TreeView from "../../components/tree/TreeView";
import mapToView from "../utils/mapToView";
import getFolderOptions from "../utils/getFolderOptions";


export default function Directories(props) {
    const directoriesToRender = useMemo(() => {
        return props.hook.items.filter(item => item instanceof Folder && !item.parent).map(f => {
            return mapToView(f, props.hook)
        })
    }, [props.hook.items])
    const handleDragAction = (event) => {
        event.preventDefault()
        switch (event.type){
            case 'dragleave':{
                event.currentTarget.parentNode.classList.remove(styles.hovered)
                break
            }
            case 'dragover':{
                event.currentTarget.parentNode.classList.add(styles.hovered)
                break
            }
            case'drop':{
                event.currentTarget.parentNode.classList.remove(styles.hovered)
                console.log(event.currentTarget.id)
                const item = props.hook.items.find(f => f.id === event.currentTarget.id.replace('-node', ''))
                if(item && item.id !== event.dataTransfer.getData('text') && item.parent !== event.dataTransfer.getData('text'))
                    props.hook.moveFile(event.dataTransfer.getData('text'), item.id)
                break
            }
            default:
                break
        }
    }
    useEffect(() => {
        props.hook.items.forEach(node => {
            const el = document.getElementById(node.id+'-node')
            if(el) {
                el.addEventListener('dragleave', handleDragAction)
                el.addEventListener('dragover', handleDragAction)
                el.addEventListener('drop', handleDragAction)
            }
        })
        return () => {
            props.hook.items.forEach(node => {
                const el = document.getElementById(node.id+'-node')
                if(el) {
                    el.removeEventListener('dragleave', handleDragAction)
                    el.removeEventListener('dragover', handleDragAction)
                    el.removeEventListener('drop', handleDragAction)
                }
            })
        }
    },[props.hook.items])
    return (
        <div data-directories-wrapper={'true'} className={styles.wrapper}>
            <ContextMenu
                options={[
                    ...getFolderOptions(props.hook),
                    {
                        requiredTrigger: 'data-folder',
                        label: 'Rename',
                        icon: <span className={'material-icons-round'}>edit</span>,
                        onClick: (node) =>{
                            const target = document.getElementById(node.getAttribute('data-folder') + '-node')
                            if(target) {
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
                        label: 'New directory',
                        icon: <span className={'material-icons-round'}>create_new_folder</span>,
                        onClick: () => {
                            const newFolder = new Folder('New folder', undefined)
                            props.hook.pushFolder(newFolder)
                        }
                    }
                ]}
                triggers={[
                    'data-directories-wrapper',
                    'data-folder'
                ]}>
                <TreeView
                    selected={{id: props.hook.currentDirectory}}
                    nodes={directoriesToRender}
                    handleRename={(folder, newName) => {
                        const folderObj = props.hook.items.find(f => f.id === folder.id)
                        if(folderObj)
                        props.hook.renameFolder(folderObj, newName)
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
