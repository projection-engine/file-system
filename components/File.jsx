import PropTypes from "prop-types";
import styles from '../styles/Files.module.css'
import React, {useEffect, useState} from "react";
import {ToolTip} from "@f-ui/core";
import parseFileType from "../../utils/parseFileType";

export default function File(props) {
    const [file, setFile] = useState()

    useEffect(() => {
        if (props.data.type === 'jpg' || props.data.type === 'jpeg' || props.data.type === 'png')
            props.hook.getFile(props.data.id).then(res => {
                setFile(res)
            })
    }, [])

    const getIcon = (type) => {
        switch (type) {
            case 'obj': {
                return (
                    <div className={styles.icon} style={{border: 'none'}}>
                        <span className={'material-icons-round'} style={{fontSize: '2.5rem'}}>category</span>
                    </div>
                )
            }
            case 'jpg':
            case 'jpeg':
            case 'png': {
                return (
                    <div className={styles.icon} style={{border: 'none'}}>
                        <img src={file?.blob} alt={'image'} className={styles.image}/>
                    </div>
                )
            }
            case 'material': {
                return (
                    <div
                        className={styles.icon}
                        style={{border: 'none'}}
                    >
                        <span className={'material-icons-round'} style={{fontSize: '2.5rem'}}>language</span>
                    </div>
                )
            }
            default:
                return (
                    <div className={styles.icon} style={{border: 'none'}}>
                        <span className={'material-icons-round'} style={{fontSize: '2.5rem'}}>description</span>
                    </div>
                )
        }
    }

    return (
        <div
            onDragStart={e => e.dataTransfer.setData('text', props.data.id)}
            draggable={true}
            onDoubleClick={() => {
                if (props.data.type === 'material')
                    props.openEngineFile(props.data.id, props.data.name)
                else
                    props.setSelected(props.data.id)
            }}
            className={styles.file}
            data-context={'file'}
            data-identification={props.data.id}>
            {getIcon(props.data.type)}
            <div className={styles.contentWrapper}>
                <div className={[styles.label, styles.overflow].join(' ')}>
                    {props.data.name}
                </div>
                <div className={[styles.type, styles.overflow].join(' ')}>
                    {parseFileType(props.data.type)}
                </div>
            </div>
            <ToolTip align={"middle"} justify={'end'}>
                <div className={styles.infoRow}>
                    Name:
                    <div className={styles.infoRowContent}>
                        {props.data.name}
                    </div>
                </div>
                <div className={styles.infoRow}>
                    Creation date:
                    <div className={styles.infoRowContent}>
                        {props.data.creationDate?.toLocaleDateString()}
                    </div>
                </div>
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
            </ToolTip>
        </div>
    )
}

File.propTypes = {
    data: PropTypes.object,
    selected: PropTypes.string,
    setSelected: PropTypes.func,
    openEngineFile: PropTypes.func.isRequired,
    hook: PropTypes.object
}
