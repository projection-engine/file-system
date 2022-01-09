import PropTypes from "prop-types";
import styles from '../styles/Control.module.css'
import {Button} from "@f-ui/core";
import React, {useRef} from "react";
import handleImport from "../utils/handleImport";

export default function Control(props) {


    const ref = useRef()
    return (
        <div className={styles.wrapper}>
            <div style={{display: 'flex', width: '100%', alignItems: 'center', gap: '4px'}}>
                <Button   clssName={styles.button} onClick={() => props.setHidden(!props.hidden)}>
                    <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>{props.hidden ? 'expand_more' : 'expand_less'}</span>
                </Button>
                <h1 className={styles.header}>
                    {props.label}
                </h1>
            </div>
            <input
                type={'file'}
                ref={ref} accept={props.accept}
                multiple={true}
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
    accept: PropTypes.array,
    label: PropTypes.string,
    setHidden: PropTypes.func,
    hidden: PropTypes.bool
}
