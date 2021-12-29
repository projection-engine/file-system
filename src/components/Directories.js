import PropTypes from "prop-types";
import styles from '../styles/Directories.module.css'
import InlineFolder from "./InlineFolder";
import ContextMenu from "./ContextMenu";
import React, {useState} from "react";
import RenameModal from "./RenameModal";
import Folder from "../templates/Folder";


export default function Directories(props) {
    const [openModal, setOpenModal] = useState(false)
    const [currentItem, setCurrentItem] = useState()


    return (
        <>
            <RenameModal
                open={openModal}
                setOpen={setOpenModal}
                submit={(ev) => {
                    if(currentItem)
                        props.hook.renameFolder(currentItem, ev)
                    else
                        props.hook.pushFolder(new Folder(ev))
                    setOpenModal(false)
                    setCurrentItem(undefined)
                }}
                originalValue={currentItem?.name}/>

            <ContextMenu
                asDirectory={true}
                handleChange={(e) => {
                    if (e.type === 'delete') {
                        if(props.hook.directories.length === 1){
                            props.hook.setAlert({
                                type: 'info',
                                message: 'You cannot delete the last directory.'
                            })
                        }
                        else {
                            const target = props.hook.directories.find(f => f.id === e.target)
                            props.hook.removeFolder(target)
                        }
                    } else {
                        const target = props.hook.directories.find(f => f.id === e.target)
                        setCurrentItem(target)
                        setOpenModal(true)
                    }
                }}
                className={styles.wrapper}>
                {props.hook.directories.map(dir => (
                    <React.Fragment key={dir.id}>
                        <InlineFolder
                            moveFile={props.hook.moveFile}
                            setCurrentDirectory={props.hook.setCurrentDirectory}
                            data={dir}
                            index={0}
                            currentSelected={props.hook.currentDirectory.id}/>
                    </React.Fragment>
                ))}
            </ContextMenu>
        </>
    )
}

Directories.propTypes = {
    hook: PropTypes.object.isRequired
}
