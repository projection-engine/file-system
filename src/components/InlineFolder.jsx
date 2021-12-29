import PropTypes from "prop-types";
import styles from '../styles/Directories.module.css'
import {Button} from "@f-ui/core";
import {useRef, useState} from "react";
import React from 'react'

export default function InlineFolder(props) {
    const [open, setOpen] = useState(false)
    const ref = useRef()

    return (
        <div
            ref={ref}
            className={styles.folder}
            data-identification={props.data.id}
            data-context={'dir'}
            onDragOver={e => e.preventDefault()}
            onDrop={(e) => props.moveFile(e.dataTransfer.getData("text"), props.data.id)}
        >
            <Button
                variant={"minimal-horizontal"}
                highlight={props.data.id === props.currentSelected}
                onClick={() => {
                    props.setCurrentDirectory(props.data)
                    setOpen(!open)
                }}
                className={styles.folderContent}>
                <div className={styles.overflow}>
                    {props.data.name}
                </div>

            </Button>

        </div>
    )
}

InlineFolder.propTypes = {
    data: PropTypes.object,
    index: PropTypes.number,
    currentSelected: PropTypes.string,
    setCurrentDirectory: PropTypes.func,
    moveFile: PropTypes.func
}
