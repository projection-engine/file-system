import styles from './styles/Explorer.module.css'
import PropTypes from "prop-types";
import React, {useEffect, useMemo, useState} from "react";
import Directories from "./components/Directories";
import Items from "./components/Items";
import ImportOptions from "./components/ImportOptions";
import Visualizer from "./components/Visualizer";
import Folder from "./templates/Folder";
import ResizableBar from "../resizable/ResizableBar";
import {Button} from "@f-ui/core";

export default function Explorer(props) {
    const [selected, setSelected] = useState()
    const [hidden, setHidden] = useState(true)
    const [searchString, setSearchString] = useState('')

    useEffect(() => {
        setHidden(true)
    }, [props.currentTab])
    const findParent = (searchFor, searchBase) => {
        let res = []
        const found = searchBase.find(n => n.id === searchFor)
        if (found) {
            if (found.parent)
                res = res.concat([findParent(found.parent, searchBase)])
            res.push(found)
        }
        return res.flat()
    }
    const path = useMemo(() => {
        const folders = props.hook.items.filter(i => i instanceof Folder)
        return findParent(props.hook.currentDirectory, folders)
    }, [props.hook.currentDirectory, props.hook.items])

    return (
        <div className={styles.wrapper} style={{height: hidden ? '35px' : undefined}} ref={props.hook.ref}>
            <div className={styles.content} style={{width: '20%'}}>
                <div className={styles.contentWrapper}>
                    <Button clssName={styles.button} onClick={() => setHidden(!hidden)}>
                        <span className={'material-icons-round'}>{hidden ? 'expand_more' : 'expand_less'}</span>
                    </Button>
                    <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>source</span>
                    <div className={styles.overflow}>
                        Content browser
                    </div>

                </div>
                {hidden ? null : <Directories {...props}/>}
            </div>
            <ResizableBar type={'width'} color={'var(--fabric-border-primary)'}/>
            <div className={styles.content}>
                <div className={styles.contentWrapper} style={{paddingLeft: '8px'}}>
                    <ImportOptions
                        searchString={searchString}
                        setSearchString={v => {
                            if (hidden)
                                setHidden(false)
                            setSearchString(v)
                        }}
                        hidden={hidden} setHidden={setHidden} {...props} path={path}
                    />
                </div>
                {hidden ? null : <Items
                    {...props}
                    searchString={searchString}
                    setSelected={setSelected}
                    accept={props.accept ? props.accept : []}
                />}
            </div>
            <Visualizer setSelected={setSelected} selected={selected} hook={props.hook}/>
        </div>
    )
}

Explorer.propTypes = {
    currentTab: PropTypes.number,
    openEngineFile: PropTypes.func.isRequired,
    hook: PropTypes.object.isRequired,
    accept: PropTypes.array,
    label: PropTypes.string,
    setAlert: PropTypes.func.isRequired
}
