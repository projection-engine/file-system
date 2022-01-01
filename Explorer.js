import styles from './styles/Explorer.module.css'
import PropTypes from "prop-types";
import React, {useState} from "react";
import Directories from "./components/Directories";
import Files from "./components/Files";
import Control from "./components/Control";
import {Alert} from "@f-ui/core";
import Visualizer from "./components/Visualizer";

export default function Explorer(props) {
    const [selected, setSelected] = useState()
    return (
        <div className={styles.wrapper} ref={props.hook.ref}>
            <Visualizer setSelected={setSelected} selected={selected}/>
            <Control {...props}/>
            <div className={styles.content}>
                <Directories {...props}/>
                <Files {...props} openEngineFile={props.openEngineFile} setSelected={setSelected} accept={props.accept ? props.accept : []}/>
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
    openEngineFile: PropTypes.func.isRequired,
    hook: PropTypes.object.isRequired,
    accept: PropTypes.array
}
