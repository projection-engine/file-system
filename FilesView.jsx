import styles from './styles/Explorer.module.css'
import PropTypes from "prop-types";
import React, {useEffect, useMemo, useState} from "react";
import Directories from "./components/Directories";
import Cards from "./components/card/Cards";
import ControlBar from "./components/ControlBar";

import {Button} from "@f-ui/core";
import useDB from "./hooks/useDB";

import ListItems from "./components/list/ListItems";

import ResizableBar from "../../components/resizable/ResizableBar";

export default function FilesView(props) {
    const [selected, setSelected] = useState()
    const [hidden, setHidden] = useState(true)
    const [searchString, setSearchString] = useState('')

    const hook = useDB(props.setAlert, props.id)
    const [visualizationType, setVisualizationType] = useState(0)
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
        const curr = hook.currentDirectory

        if (curr !== null && curr !== undefined && curr.id !== undefined) {
            const path = (`projects\\${props.id}\\assets`)

            return curr.id
                .split(path)[1]
                .replaceAll('\\', '/')
                .split('/')
                .map(p => {
                    return {
                        id: undefined,
                        name: p
                    }
                })
        }
        return []
    }, [hook.currentDirectory, hook.items])

    useEffect(() => {
        if (hidden && hook.ref.current)
            hook.ref.current.previousSibling.previousSibling.style.height = '100%'
    }, [hidden])

    if (hook.currentDirectory !== null && hook.currentDirectory !== undefined && hook.currentDirectory.id)
        return (
            <>
                <ResizableBar
                    type={'height'}

                    onResize={() => {
                        if (hidden && hook.ref.current.getBoundingClientRect().height > 35)
                            setHidden(false)
                    }}
                    onResizeEnd={() => {
                        if (hook.ref.current.getBoundingClientRect().height <= 35)
                            setHidden(true)
                    }}/>
                <div className={styles.wrapper} style={{height: hidden ? '35px' : undefined}} ref={hook.ref}>
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
                        {hidden ? null : <Directories hook={hook} {...props}/>}
                    </div>
                    <ResizableBar type={'width'} color={'var(--fabric-border-primary)'}/>
                    <div className={styles.content}>
                        <div className={styles.contentWrapper} style={{paddingLeft: '8px'}}>
                            <ControlBar
                                searchString={searchString}
                                visualizationType={visualizationType}
                                setVisualizationType={setVisualizationType}
                                setSearchString={v => {
                                    if (hidden)
                                        setHidden(false)
                                    setSearchString(v)
                                }}
                                hidden={hidden} hook={hook} setHidden={setHidden} {...props} path={path}
                            />
                        </div>

                        {visualizationType === 2 ?
                            <ListItems
                                {...props}
                                hidden={hidden}
                                hook={hook}
                                visualizationType={visualizationType}
                                searchString={searchString}
                                setSelected={setSelected}
                                selected={selected}
                                accept={props.accept ? props.accept : []}
                            />
                            :
                            <Cards
                                {...props}
                                hidden={hidden}
                                hook={hook}
                                visualizationType={visualizationType}
                                searchString={searchString}
                                setSelected={setSelected}
                                selected={selected}
                                accept={props.accept ? props.accept : []}
                            />}

                    </div>

                </div>
            </>
        )
    else
        return null
}

FilesView.propTypes = {
    id: PropTypes.string,
    currentTab: PropTypes.number,
    openEngineFile: PropTypes.func.isRequired,
    label: PropTypes.string,
    setAlert: PropTypes.func.isRequired
}
