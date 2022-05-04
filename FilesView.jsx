import styles from './styles/Explorer.module.css'
import PropTypes from "prop-types";
import React, {useEffect, useMemo, useState} from "react";
import Directories from "./components/Directories";
import Items from "./components/Items";
import ControlBar from "./components/ControlBar";

import {Button} from "@f-ui/core";
import useFiles from "./hooks/useFiles";


import ResizableBar from "../../components/resizable/ResizableBar";
import DeleteConfirmation from "./components/DeleteConfirmation";
import useHotKeys, {KEYS} from "../../pages/project/hooks/useHotKeys";
import handleDelete from "./utils/handleDelete";
import useBookmarks from "./hooks/useBookmarks";


export default function FilesView(props) {
    const hook = useFiles(props.setAlert)
    const bookmarksHook = useBookmarks(hook.fileSystem)

    const [selected, setSelected] = useState([])
    const [hidden, setHidden] = useState(false)
    const [searchString, setSearchString] = useState('')


    const [visualizationType, setVisualizationType] = useState(0)
    // useEffect(() => {
    //     setHidden(true)
    // }, [props.currentTab])
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
        let response = [{
            name: 'Assets',
            path: '\\'
        }]

        const findParent = (node) => {
            const p = hook.items.find(n => {
                return n.id === node.parent
            })
            let res = []

            if (p)
                res.push(...findParent(p).flat(), {name: p.name, path: p.id})

            return res
        }
        response.push(...findParent(hook.currentDirectory))
        if (hook.currentDirectory.name)
            response.push({
                name: hook.currentDirectory.name,
                path: hook.currentDirectory.id
            })

        return response
    }, [hook.currentDirectory, hook.items])

    useEffect(() => {
        if (hidden && hook.ref.current)
            hook.ref.current.previousSibling.previousSibling.style.height = '100%'
    }, [hidden])
    useHotKeys({
        focusTarget: props.id + '-files',
        actions: [
            {
                require: [KEYS.Delete],
                callback: () => {
                    if (selected.length > 0)
                        handleDelete(selected[0], hook, bookmarksHook)
                }
            }
        ]
    }, [selected])
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
                <DeleteConfirmation hook={hook}/>
                <div className={styles.content} style={{width: '20%'}}>
                    <div className={styles.header}>
                        <Button className={styles.button} onClick={() => setHidden(!hidden)}>
                            <span className={'material-icons-round'}>{hidden ? 'expand_more' : 'expand_less'}</span>
                        </Button>
                        <div className={styles.overflow}>
                            Content browser
                        </div>
                    </div>
                    {hidden ? null : <Directories hook={hook} bookmarksHook={bookmarksHook} {...props}/>}
                </div>
                <ResizableBar type={'width'} color={'var(--fabric-border-primary)'}/>
                <div className={styles.content} id={props.id + '-files'}>
                    <ControlBar
                        {...props}
                        bookmarksHook={bookmarksHook}
                        searchString={searchString}
                        visualizationType={visualizationType}
                        setVisualizationType={setVisualizationType}
                        setSearchString={v => {
                            if (hidden)
                                setHidden(false)
                            setSearchString(v)
                        }}
                        hidden={hidden}
                        hook={hook}
                        path={path}
                    />

                    <Items
                        bookmarksHook={bookmarksHook}
                        setAlert={props.setAlert}
                        openEngineFile={props.openEngineFile}
                        hidden={hidden}
                        hook={hook}
                        visualizationType={visualizationType}
                        searchString={searchString}
                        setSelected={setSelected}
                        selected={selected}
                        accept={props.accept ? props.accept : []}
                    />

                </div>

            </div>
        </>
    )

}

FilesView.propTypes = {
    id: PropTypes.string,
    currentTab: PropTypes.number,
    openEngineFile: PropTypes.func.isRequired,
    label: PropTypes.string,
    setAlert: PropTypes.func.isRequired
}
