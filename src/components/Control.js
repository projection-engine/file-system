import PropTypes from "prop-types";
import styles from '../styles/Control.module.css'
import {Button} from "@f-ui/core";
import {useRef} from "react";
import handleImport from "../utils/handleImport";
import React from 'react'

export default function Control(props) {


    const ref = useRef()
    return (
        <div className={styles.wrapper}>
            <h1 className={styles.header}>
                {props.hook.rootName}
            </h1>
            <input
                type={'file'}
                ref={ref} accept={props.accept}
                onChange={e => {
                    handleImport(Array.from(e.target.files), props.hook)
                    e.target.value = "";
                }}
                style={{display: 'none'}}
            />
            <Button onClick={() => ref.current.click()} className={styles.button} variant={'minimal-horizontal'}>
                <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>attach_file</span>
                Attach new file
            </Button>

        </div>
    )
}

Control.propTypes = {
    hook: PropTypes.object.isRequired,
    accept: PropTypes.array
}
