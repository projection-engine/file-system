import PropTypes from "prop-types";
import styles from '../styles/Files.module.css'
import React, {useState} from "react";
import File from "./File";
import ContextMenu from "./ContextMenu";
import handleImport from "../utils/handleImport";
import RenameModal from "./RenameModal";
import FileObj from '../templates/File'

export default function Files(props) {
    const [openModal, setOpenModal] = useState(false)
    const [currentItem, setCurrentItem] = useState()


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
            }}>
            <RenameModal
                open={openModal}
                setOpen={setOpenModal}
                submit={(ev) => {
                    props.hook.renameFile(currentItem, ev)
                    setOpenModal(false)
                    setCurrentItem(undefined)
                }}
                originalValue={currentItem?.name}/>
            <ContextMenu
                className={styles.wrapper}
                handleChange={ev => {
                    switch (ev.type) {
                        case 'delete': {
                            props.hook.removeFile(props.hook.currentDirectory.items.find(e => e.id === ev.target))
                            break
                        }
                        case 'rename': {
                            setCurrentItem(props.hook.currentDirectory.items.find(e => e.id === ev.target))
                            setOpenModal(true)
                            break
                        }
                        case 'create-material': {
                            const newFile = new FileObj('New material', 'material', 0)
                            props.hook.pushFile(newFile, JSON.stringify({name: 'New Material'}))
                            break
                        }
                        default:
                            break
                    }
                }}
                asDirectory={false}
            >

                {props.hook.currentDirectory.items.length > 0 ?
                    props.hook.currentDirectory.items.filter((v, i, a) => a.indexOf(v) === i).map(child => (
                        <React.Fragment key={child.id}>
                            <File
                                data={child}
                                  selected={props.selected}
                                  setSelected={props.setSelected}
                                  openEngineFile={props.openEngineFile}
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

Files.propTypes = {
    selected: PropTypes.string,
    setSelected: PropTypes.func,
    openEngineFile: PropTypes.func.isRequired,
    accept: PropTypes.array,
    hook: PropTypes.object.isRequired
}
