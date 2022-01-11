import PropTypes from "prop-types";
import styles from '../styles/Files.module.css'
import React, {useEffect, useMemo, useRef, useState} from "react";
import {ToolTip} from "@f-ui/core";
import parseFileType from "../utils/parseFileType";
import getIcon from "../utils/getIcon";

export default function Item(props) {
    const [file, setFile] = useState()

    useEffect(() => {
        if (props.data.type === 'jpg' || props.data.type === 'jpeg' || props.data.type === 'png')
            props.hook.getFile(props.data.id).then(res => {
                setFile(res)
            })
    }, [])

    const ref = useRef()
    useEffect(() => {
        if (props.type === 'Folder')
            ref.current.setAttribute('data-folder', props.data.id)
        else
            ref.current.setAttribute('data-file', props.data.id)
    }, [props.type])

    const currentlyOnRename = useMemo(() => {
        return props.onRename === props.data.id
    }, [props.onRename])
    const [currentLabel, setCurrentLabel] = useState(props.data.name)
    useEffect(() => {
        setCurrentLabel(props.data.name)
    }, [props.data.name])
    return (
        <div
            ref={ref}
            onDragStart={e => e.dataTransfer.setData('text', props.data.id)}
            draggable={!currentlyOnRename}
            onDoubleClick={() => {
                if (props.type === 'File') {
                    if (props.data.type === 'material')
                        props.openEngineFile(props.data.id, currentLabel)
                    else
                        props.setSelected(props.data.id)
                } else if(props.type === 'Folder')
                    props.hook.setCurrentDirectory(props.data.id)
            }}
            className={styles.file}
            style={{
                padding: props.type === 'Folder' ? '8px 4px 16px 4px' : undefined
            }}
            onDragOver={e => {
                if(props.type === 'Folder') {
                    e.preventDefault()
                    ref.current?.classList.add(styles.hovered)
                }
            }}
            onDragLeave={e => {
                if(props.type === 'Folder') {
                    e.preventDefault()
                    ref.current?.classList.remove(styles.hovered)
                }
            }}
            onDrop={e => {
                e.preventDefault()
                if(e.dataTransfer.getData('text') !== props.data.id && e.dataTransfer.getData('text') !== props.data.parent)
                    props.hook.moveFile(e.dataTransfer.getData('text'), props.data.id)
            }}
        >
            {getIcon(props.data.type ? props.data.type : props.type, file)}
            <div className={styles.infoWrapper}>
                {currentlyOnRename ?
                    <input
                        className={styles.input}
                        onKeyPress={key => {
                            if (key.code === 'Enter')
                                props.submitRename(currentLabel)
                        }}
                        onBlur={() => {
                            props.submitRename(currentLabel)
                        }}
                        onChange={e => setCurrentLabel(e.target.value)}
                        value={currentLabel}
                    />
                    :
                    (props.type === 'File' ?
                            <div className={styles.contentWrapper}>
                                <div className={[styles.label, styles.overflow].join(' ')}>
                                    {currentLabel}
                                </div>
                                <div className={[styles.type, styles.overflow].join(' ')}>
                                    {parseFileType(props.data.type)}
                                </div>
                            </div>
                            :
                            <div className={[styles.label, styles.overflow].join(' ')}>
                                {currentLabel}
                            </div>
                    )
                }
            </div>
            <ToolTip align={"middle"} justify={'end'}>
                <div className={styles.infoRow}>
                    Name:
                    <div className={styles.infoRowContent}>
                        {currentLabel}
                    </div>
                </div>
                <div className={styles.infoRow}>
                    Creation date:
                    <div className={styles.infoRowContent}>
                        {props.data.creationDate?.toLocaleDateString()}
                    </div>
                </div>
                {props.type === 'File' ?
                    <>
                        <div className={styles.infoRow}>
                            Type:
                            <div className={styles.infoRowContent}>
                                {props.data.type}
                            </div>
                        </div>
                        <div className={styles.infoRow}>
                            Size:
                            <div className={styles.infoRowContent}>
                                {props.data.size ? (props.data.size < 100000 ? (props.data.size / 1000).toFixed(2) + 'KB' : (props.data.size / (10 ** 6)).toFixed(2) + ' MB') : 'NaN'}
                            </div>
                        </div>
                        <div className={styles.infoRow}>
                            ID:
                            <div className={styles.infoRowContent}>
                                {props.data.id}
                            </div>
                        </div>
                    </>
                    :
                    null
                }
            </ToolTip>
        </div>
    )
}

Item.propTypes = {
    type: PropTypes.oneOf(['File', 'Folder']),
    data: PropTypes.object,
    selected: PropTypes.string,
    setSelected: PropTypes.func,
    openEngineFile: PropTypes.func.isRequired,
    hook: PropTypes.object,
    onRename: PropTypes.string,
    submitRename: PropTypes.func
}
