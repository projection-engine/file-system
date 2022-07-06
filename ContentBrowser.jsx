import styles from "./styles/ContentBrowser.module.css"
import React, {useDeferredValue, useMemo, useState} from "react"
import SideBar from "./components/SideBar"
import Files from "./components/Files"
import ControlBar from "./components/ControlBar"
import useContentBrowser from "./hooks/useContentBrowser"
import ResizableBar from "../../../components/resizable/ResizableBar"
import DeleteConfirmation from "./components/DeleteConfirmation"
import FileSystem from "../../utils/files/FileSystem"
import COMPONENTS from "../../engine/templates/COMPONENTS"
import PropTypes from "prop-types"
import Header from "../../../components/view/components/Header"

export default function ContentBrowser(props) {
    const hook = useContentBrowser()
    const [selected, setSelected] = useState([])
    const [fileType, setFileType] = useState()
    const [searchString, setSearchString] = useState("")
    const [visualizationType, setVisualizationType] = useState(0)
    const search = useDeferredValue(searchString)
    const path = useMemo(() => {
        const findParent = (node) => {
            const p = hook.items.find(n => n.id === node.parent)
            return p ? [findParent(p), {name: p.name, path: p.id}] : []
        }
        const response = [{name: "Assets", path: FileSystem.sep}, findParent(hook.currentDirectory)].flat(Number.POSITIVE_INFINITY)
        if (hook.currentDirectory.name)
            response.push({
                name: hook.currentDirectory.name,
                path: hook.currentDirectory.id
            })
        return response
    }, [hook.currentDirectory, hook.items])
    const targetEntities = useMemo(() => {
        const values = hook.entities.values()
        return Array.from(values)
            .filter(e => e.components[COMPONENTS.MESH])
            .map(e => {
                return {
                    name: e.name,
                    entity: e.id,
                    mesh: e.components[COMPONENTS.MESH].meshID
                }
            })
    }, [hook.entities])

    return (
        <>
            <Header {...props} title={"Content Browser"} icon={"folder"}>
                <ControlBar
                    fileType={fileType}
                    setFileType={setFileType}
                    searchString={searchString}
                    visualizationType={visualizationType}
                    setVisualizationType={setVisualizationType}
                    setSearchString={setSearchString}
                    hook={hook}
                    path={path}
                />
            </Header>
            {props.hidden ? 
                null :
                <div className={styles.wrapper}>
                    <DeleteConfirmation hook={hook} removeEntity={hook.removeEntity}/>
                    <SideBar entities={targetEntities} hook={hook}/>
                    <ResizableBar type={"width"}/>
                    <Files
                        entities={targetEntities}
                        setSearchString={setSearchString}
                        fileType={fileType}
                        setFileType={setFileType}
                        hook={hook}
                        visualizationType={visualizationType}
                        searchString={search}
                        setSelected={setSelected}
                        selected={selected}
                    />
                </div>
            }
        </>
    )
}

ContentBrowser.propTypes={
    hidden: PropTypes.bool,
    switchView: PropTypes.func,
    orientation: PropTypes.string,
}