import PropTypes from "prop-types";
import styles from '../styles/Item.module.css'
import React, {useEffect, useMemo, useRef, useState} from "react";
import {ToolTip} from "../../../../fabric/src/index";
import parseFileType from "../utils/parseFileType";
import getIcon from "../utils/getIcon";
import Folder from "../templates/Folder";
import {DataRow} from "@f-ui/core";

export default function Item(props) {
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
    const className = useMemo(() => {
        switch (props.visualizationType) {
            case 0:
                return {
                    wrapper: styles.fileBig,
                    label: styles.fileBigLabel,
                    icon: styles.fileBigIcon
                }
            case 1:
                return {
                    wrapper: styles.fileSmall,
                    label: styles.fileSmallLabel,
                    icon: styles.fileSmallIcon
                }

            case 2:
                return {
                    wrapper: styles.listRow,
                    label: styles.listRowLabel,
                    icon: styles.listRowIcon
                }

        }
    }, [props.visualizationType])

    return (
        <div
            ref={ref}
            onDragStart={e => e.dataTransfer.setData('text', props.data.id)}
            draggable={!currentlyOnRename}
            onDoubleClick={() => {
                if (props.type === 'File') {
                    if (props.data.type === 'material' || props.data.type === 'skybox' || props.data.type === 'obj' || props.data.type === 'gltf')
                        props.openEngineFile(props.data.id, currentLabel)
                    else
                        props.setSelected(props.data.id)
                } else if (props.type === 'Folder')
                    props.hook.setCurrentDirectory(props.data.id)
            }}
            className={[styles.file, className.wrapper].join(' ')}
            data-focused={`${props.focusedElement === props.data.id}`}
            onDragOver={e => {
                if (props.type === 'Folder') {
                    e.preventDefault()
                    ref.current?.classList.add(styles.hovered)
                }
            }}
            onClick={() => props.setFocusedElement(props.data.id)}
            onDragLeave={e => {
                if (props.type === 'Folder') {
                    e.preventDefault()
                    ref.current?.classList.remove(styles.hovered)
                }
            }}
            onDrop={e => {
                e.preventDefault()
                e.currentTarget.parentNode.classList.remove(styles.hovered)
                const current = e.dataTransfer.getData('text')
                const foundCurrent = props.hook.items.find(f => f.id === current)

                if (props.type === 'Folder' && props.data.id !== e.dataTransfer.getData('text') && foundCurrent && props.data.parent !== e.dataTransfer.getData('text')) {
                    if (foundCurrent instanceof Folder)
                        props.hook.moveFolder(current, props.data.id)
                    else
                        props.hook.moveFile(current, props.data.id)
                }

                if (e.dataTransfer.getData('text') !== props.data.id && e.dataTransfer.getData('text') !== props.data.parent) {
                    if (props.type === 'Folder')
                        props.hook.moveFolder(e.dataTransfer.getData('text'), props.data.id)
                    else
                        props.hook.moveFile(e.dataTransfer.getData('text'), props.data.id)
                }

            }}
        >
            {/*<DataRow*/}
            {/*    selfContained={true}*/}
            {/*    object={props.data}*/}
            {/*    keys={[*/}
            {/*        {*/}
            {/*            label: 'Name',*/}
            {/*            key: 'name',*/}
            {/*            type: 'string'*/}
            {/*        },*/}
            {/*        {*/}
            {/*            label: 'Type',*/}
            {/*            key: 'type',*/}
            {/*            type: 'string'*/}
            {/*        },*/}
            {/*        {*/}
            {/*            label: 'Size',*/}
            {/*            key: 'size',*/}
            {/*            type: 'string'*/}
            {/*        },*/}
            {/*        {*/}
            {/*            label: 'Creation date',*/}
            {/*            key: 'creationDate',*/}
            {/*            type: 'date'*/}
            {/*        }*/}
            {/*    ]}/>*/}
            {getIcon(props.data.type ? props.data.type : props.type, props.data, className.icon)}
            <div className={className.label}>
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
                            <>

                                <div className={[styles.label, styles.overflow].join(' ')}>
                                    {currentLabel}
                                </div>
                                <div className={[styles.type, styles.overflow].join(' ')}>
                                    {parseFileType(props.data.type)}
                                </div>
                            </>
                            :
                            <div className={[styles.label, styles.overflow].join(' ')}
                                 style={{textAlign: 'center', padding: '8px 8px 16px 8px'}}>
                                {currentLabel}
                            </div>
                    )
                }
            </div>
            <ToolTip align={"middle"} justify={'end'}>
                <div className={styles.toolTip}>
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
                </div>
            </ToolTip>
        </div>
    )
}

Item.propTypes = {
    visualizationType: PropTypes.number,

    setFocusedElement: PropTypes.func,
    focusedElement: PropTypes.string,
    type: PropTypes.oneOf(['File', 'Folder']),
    data: PropTypes.object,
    selected: PropTypes.string,
    setSelected: PropTypes.func,
    openEngineFile: PropTypes.func.isRequired,
    hook: PropTypes.object,
    onRename: PropTypes.string,
    submitRename: PropTypes.func
}
