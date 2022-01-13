import PropTypes from "prop-types";
import styles from '../styles/Files.module.css'
import React, {useMemo, useState} from "react";
import Item from "./Item";
import ContextMenu from "../../context/ContextMenu";
import handleImport from "../utils/handleImport";
import FileObj from '../templates/File'
import Folder from "../templates/Folder";
import getFolderOptions from "../utils/getFolderOptions";

export default function Items(props) {
    const [currentItem, setCurrentItem] = useState()
    const filesToRender = useMemo(() => {

        return props.hook.items.filter(file => file.parent === props.hook.currentDirectory )
    }, [props.hook.items, props.hook.currentDirectory])

    return (
        <div
            style={{width: '100%'}}
            onDragOver={e => e.preventDefault()}
            onDrop={(e) => {
                e.preventDefault()
                let files = Array.from(e.dataTransfer.items)
                files = files.filter(f => f.kind === 'file')
                files = files.map(f => f.getAsFile())
                files = files.filter(f => {
                    let valid = true
                    const extension = f.name.split(/\.([a-zA-Z0-9]+)$/)
                    props.accept.forEach(a => {
                        valid = valid && extension.includes(a)
                    })
                    return valid
                })
                handleImport(files, props.hook)
            }}
        data-folder-wrapper={props.hook.currentDirectory}
        >
            <ContextMenu
                className={styles.wrapper}
                options={[
                    ...getFolderOptions(props.hook),
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
                        label: 'Duplicate',
                        icon: <span className={'material-icons-round'}>copy</span>,
                        onClick: (node) => props.hook.duplicateFile(node.getAttribute('data-file'))
                    },
                    {
                        requiredTrigger: 'data-file',
                        label: 'Delete',
                        icon: <span className={'material-icons-round'}>delete</span>,
                        onClick: (node) => props.hook.removeFile(props.hook.items.find(e => e.id === node.getAttribute('data-file')))
                    },
                    {
                        requiredTrigger: 'data-folder-wrapper',
                        label: 'New material',
                        icon: <span className={'material-icons-round'}>public</span>,
                        onClick: () => {
                            const newFile = new FileObj('New material', 'material', 0, undefined, props.hook.currentDirectory)
                            props.hook.pushFile(newFile, JSON.stringify({name: 'New Material'}))
                        }
                    },
                    {
                        requiredTrigger: 'data-folder-wrapper',
                        label: 'New directory',
                        icon: <span className={'material-icons-round'}>create_new_folder</span>,
                        onClick: () => {
                            const newFolder = new Folder('New directory', props.hook.currentDirectory)
                            props.hook.pushFolder(newFolder)
                        }
                    }
                ]}
                triggers={[
                    'data-folder-wrapper',
                    'data-file',
                    'data-folder'
                ]}
            >
                {filesToRender.length > 0 ?
                    filesToRender.map(child => (
                        <React.Fragment key={child.id}>
                            <Item
                                type={child.constructor.name}
                                data={child}
                                selected={props.selected}
                                setSelected={props.setSelected}
                                openEngineFile={props.openEngineFile}
                                hook={props.hook}
                                onRename={currentItem}
                                submitRename={newName => {
                                    if(newName !== child.name) {
                                        if (child.constructor.name === 'File')
                                            props.hook.renameFile(child, newName)
                                        else
                                            props.hook.renameFolder(child, newName)
                                    }
                                    setCurrentItem(undefined)
                                }}
                            />
                        </React.Fragment>
                    ))
                    :
                    <div className={styles.empty}>
                        <span className={'material-icons-round'} style={{fontSize: '100px'}}>folder</span>
                        <div style={{fontSize: '.8rem'}}>
                            Empty folder
                        </div>
                    </div>}

            </ContextMenu>
        </div>
    )
}

Items.propTypes = {
    selected: PropTypes.string,
    setSelected: PropTypes.func,
    openEngineFile: PropTypes.func.isRequired,
    accept: PropTypes.array,
    hook: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired
}
