import styles from "./styles/ContentBrowser.module.css"
import PropTypes from "prop-types"
import React, {useDeferredValue, useMemo, useState} from "react"
import SideBar from "./components/SideBar"
import Files from "./components/Files"
import ControlBar from "./components/ControlBar"
import useContentBrowser from "./hooks/useContentBrowser"


import ResizableBar from "../../../components/resizable/ResizableBar"
import DeleteConfirmation from "./components/DeleteConfirmation"
import useBookmarks from "./hooks/useBookmarks"
import FileSystem from "../../utils/files/FileSystem"

export default function ContentBrowser(props) {
    const hook = useContentBrowser()
    const bookmarksHook = useBookmarks( )
    const [selected, setSelected] = useState([])
    const [fileType, setFileType] = useState()
    const [searchString, setSearchString] = useState("")
    const [visualizationType, setVisualizationType] = useState(0)
    const search = useDeferredValue(searchString)
    const path = useMemo(() => {
        let response = [{
            name: "Assets",
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
        <div className={styles.wrapper}>
            <DeleteConfirmation hook={hook}/>
            <SideBar hook={hook} bookmarksHook={bookmarksHook} {...props}/>
            <ResizableBar type={"width"}/>
            <div className={styles.content} id={props.id + "-files"}>
                <ControlBar
                    fileType={fileType}
                    setFileType={setFileType}
                    bookmarksHook={bookmarksHook}
                    searchString={searchString}
                    visualizationType={visualizationType}
                    setVisualizationType={setVisualizationType}
                    setSearchString={setSearchString}
                    hook={hook}
                    path={path}
                />
                <Files
                    setSearchString={setSearchString}
                    fileType={fileType}
                    setFileType={setFileType}
                    bookmarksHook={bookmarksHook}
                    hook={hook}
                    visualizationType={visualizationType}
                    searchString={search}
                    setSelected={setSelected}
                    selected={selected}
                />
            </div>
        </div>
    )

}

ContentBrowser.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string
}
