import styles from "./styles/Explorer.module.css"
import PropTypes from "prop-types"
import React, {useMemo, useState} from "react"
import SideBar from "./components/SideBar"
import View from "./components/View"
import ControlBar from "./components/ControlBar"
import useFiles from "./hooks/useFiles"


import ResizableBar from "../../../components/resizable/ResizableBar"
import DeleteConfirmation from "./components/DeleteConfirmation"
import useBookmarks from "./hooks/useBookmarks"
import FileSystem from "../../utils/files/FileSystem"


export default function FilesView(props) {
    const hook = useFiles(props.setAlert)
    const bookmarksHook = useBookmarks(hook.fileSystem)
    const [selected, setSelected] = useState([])
    const [hidden, setHidden] = useState(false)
    const [searchString, setSearchString] = useState('')
    const [visualizationType, setVisualizationType] = useState(0)

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
            path: FileSystem.sep
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


    return (

        <div className={styles.wrapper} ref={hook.ref}>
            <DeleteConfirmation hook={hook}/>
            <div className={styles.content} style={{width: '20%',     borderRadius: '0 5px 5px 0'}}>
                <div className={styles.header}>
                    <label className={styles.overflow}>Content browser</label>
                </div>
                {hidden ? null : <SideBar hook={hook} bookmarksHook={bookmarksHook} {...props}/>}
            </div>
            <ResizableBar type={'width'}/>
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

                <View
                    bookmarksHook={bookmarksHook}
                    setAlert={props.setAlert}
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

    )

}

FilesView.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    setAlert: PropTypes.func.isRequired
}
