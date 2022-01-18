import PropTypes from "prop-types";
import styles from '../styles/Control.module.css'
import {Button} from "@f-ui/core";
import React, {useRef} from "react";
import handleImport from "../utils/handleImport";

export default function Control(props) {


    const ref = useRef()
    return (
        <div className={styles.wrapper}>
            <div className={styles.contentWrapper} style={{width: 'calc(25% + 12px)'}}>
                <Button clssName={styles.button} onClick={() => props.setHidden(!props.hidden)}>
                    <span className={'material-icons-round'}>{props.hidden ? 'expand_more' : 'expand_less'}</span>
                </Button>
                <h1 className={styles.header}>
                    {props.label}
                </h1>

            </div>
            <div
                className={styles.contentWrapper}
                style={{width: '100%',  borderLeft: 'var(--fabric-border-primary) 1px solid', paddingLeft: '8px'}}
            >
                {props.path.map((p, i) => (
                    <React.Fragment key={p.id}>
                        <Button className={styles.button}
                                styles={{fontWeight: props.hook.currentDirectory === p.id ? 600 : undefined}}
                                highlight={props.hook.currentDirectory === p.id}
                                onClick={() => props.hook.setCurrentDirectory(p.id)}>
                            {p.name}
                        </Button>
                        {i < props.path.length - 1 ?
                            <span className={'material-icons-round'}>chevron_right</span> : null}
                    </React.Fragment>
                ))}
            </div>
            <div className={styles.contentWrapper}>
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
                    Import
                </Button>
            </div>
        </div>
    )
}

Control.propTypes = {
    path: PropTypes.arrayOf(PropTypes.object),

    hook: PropTypes.object.isRequired,
    accept: PropTypes.array,
    label: PropTypes.string,
    setHidden: PropTypes.func,
    hidden: PropTypes.bool
}
