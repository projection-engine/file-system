import PropTypes from "prop-types"
import React, {useMemo} from "react"
import TreeView from "../../../../components/tree/TreeView"
import mapToView from "../utils/mapToView"
import getDirectoryOptions from "../utils/getDirectoryOptions"
import handleDropFolder from "../utils/handleDropFolder"
import handleRename from "../utils/handleRename"
import styles from "../styles/Directories.module.css"
import FileSystem from "../../../utils/files/FileSystem"

const ASSETS_TRIGGERS = [
    "data-node",
    "data-self"
]
const BOOKMARKS_TRIGGERS =[
    "data-root",
    "data-self"
]
export default function SideBar(props) {

    const directoriesToRender = useMemo(() => {
        const toFilter = props.hook.items.filter(item => item.isFolder && !item.parent)
        return {
            assets: [{
                id: FileSystem.sep,
                label: "Assets",
                phantomNode: true,
                onClick: () => {
                    props.hook.setCurrentDirectory({
                        id: FileSystem.sep
                    })
                },
                children: toFilter.map(f => {
                    return mapToView(f, props.hook)
                }),

                icon: <span style={{fontSize: "1rem"}}
                    className={"material-icons-round"}>inventory_2</span>,
                attributes: {"data-root": "root"},
                parent: undefined
            }],
            bookmarks: [ {
                id: "bk",
                label: "Bookmarks",
                phantomNode: true,

                children: props.bookmarksHook.bookmarks.map(f => {
                    return mapToView(f, props.hook, true)
                }),

                icon: <span style={{fontSize: "1rem"}}
                    className={"material-icons-round"}>star</span>,
                attributes: {"data-root": "root"},
                parent: undefined
            }]
        }
    }, [props.hook.items, props.bookmarksHook.bookmarks])
    const options = useMemo(() => {
        return getDirectoryOptions(props)
    }, [])

    return (
        <>
            <div className={styles.wrapper}>
                <TreeView
                    contextTriggers={ASSETS_TRIGGERS}
                    options={options}
                    draggable={true}
                    onDrop={(event, target) => handleDropFolder(event, target, props.setAlert, props.hook)}
                    onDragLeave={(event) => event.preventDefault()}
                    onDragOver={(event) => event.preventDefault()}
                    onDragStart={(e, t) => e.dataTransfer.setData("text", JSON.stringify([t]))}
                    selected={props.hook.currentDirectory.id}
                    nodes={directoriesToRender.assets} className={styles.accordion}
                    handleRename={(item, name) => handleRename(item, name, props.hook, undefined, props.bookmarksHook)}
                />

            </div>
            <div className={styles.wrapper}>
                <TreeView
                    contextTriggers={BOOKMARKS_TRIGGERS}
                    options={options}
                    draggable={true}
                    onDrop={(event, target) => handleDropFolder(event, target, props.setAlert, props.hook)}
                    onDragLeave={(event) => event.preventDefault()}
                    onDragOver={(event) => event.preventDefault()}
                    onDragStart={(e, t) => e.dataTransfer.setData("text", JSON.stringify([t]))}
                    selected={props.hook.currentDirectory.id}
                    nodes={directoriesToRender.bookmarks} className={styles.accordion}
                    handleRename={(folder, newName) => handleRename(folder, newName, props.hook, undefined, props.bookmarksHook)}
                />

            </div>
        </>
    )
}

SideBar.propTypes = {
    bookmarksHook: PropTypes.object,
    hook: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired
}
