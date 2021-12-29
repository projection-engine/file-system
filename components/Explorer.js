import styles from '../styles/Explorer.module.css'
import PropTypes from "prop-types";
import React from "react";
import Directories from "./Directories";
import Files from "./Files";
import Control from "./Control";
import {Alert} from "@f-ui/core";

export default function Explorer(props) {
    return (
        <div className={styles.wrapper} ref={props.hook.ref}>
            <Control {...props}/>
            <div className={styles.content}>
                <Directories {...props}/>
                <Files {...props} accept={props.accept ? props.accept : []}/>
            </div>

            <Alert open={props.hook.alert.type !== undefined} handleClose={() => props.hook.setAlert({})} variant={props.hook.alert.type} delay={3500}>
                <div style={{color: 'var(--fabric-color-primary)'}}>
                    {props.hook.alert.message}
                </div>
            </Alert>
        </div>
    )
}

Explorer.propTypes = {
    hook: PropTypes.object.isRequired,
    accept: PropTypes.array
}
