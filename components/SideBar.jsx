import PropTypes from "prop-types"
import React, {useMemo} from "react"
import TreeView from "../../../../components/tree/TreeView"
import mapToView from "../utils/mapToView"
import getDirectoryOptions from "../utils/getDirectoryOptions"
import handleDropFolder from "../utils/handleDropFolder"
import handleRename from "../utils/handleRename"
import styles from "../styles/ContentBrowser.module.css"
import FileSystem from "../../../utils/files/FileSystem"
import {Icon} from "@f-ui/core"

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
                onClick: () => {
                    props.hook.setCurrentDirectory({
                        id: FileSystem.sep
                    })
                },
                children: toFilter.map(f => mapToView(f, props.hook)),
                icon: <Icon styles={{fontSize: "1rem"}}>inventory_2</Icon>,
                attributes: {"data-root": "root"}
            }],
            bookmarks: [ {
                id: "bk",
                label: "Bookmarks",
                disabled: true,
                children: props.hook.bookmarks.map(f => mapToView(f, props.hook, true)),
                icon: <Icon styles={{fontSize: "1rem"}}>star</Icon>,
                attributes: {"data-root": "root"}
            }]
        }
    }, [props.hook.items, props.hook.bookmarks])
    const options = useMemo(() => getDirectoryOptions(props), [])

    return (
        <div className={styles.content} style={{width: "20%"}}>
            <div className={styles.header}>
                <label className={styles.overflow}>Content browser</label>
            </div>
            <div style={{padding: "4px", display: "grid", gap: "4px", height: "100%"}}>
                <TreeView
                    contextTriggers={ASSETS_TRIGGERS}
                    options={options}
                    draggable={true}
                    onDrop={(event, target) => handleDropFolder(event, target, props.hook)}
                    onDragLeave={(event) => event.preventDefault()}
                    onDragOver={(event) => event.preventDefault()}
                    onDragStart={(e, t) => e.dataTransfer.setData("text", JSON.stringify([t]))}
                    selected={props.hook.currentDirectory.id}
                    nodes={directoriesToRender.assets} className={styles.accordion}
                    handleRename={(item, name) => handleRename(item, name, props.hook)}
                />

                <TreeView
                    contextTriggers={BOOKMARKS_TRIGGERS}
                    options={options}
                    draggable={true}
                    onDrop={(event, target) => handleDropFolder(event, target, props.hook)}
                    onDragLeave={(event) => event.preventDefault()}
                    onDragOver={(event) => event.preventDefault()}
                    onDragStart={(e, t) => e.dataTransfer.setData("text", JSON.stringify([t]))}
                    selected={props.hook.currentDirectory.id}
                    nodes={directoriesToRender.bookmarks} className={styles.accordion}
                    handleRename={(folder, newName) => handleRename(folder, newName, props.hook)}
                />
            </div>
        </div>
    )
}

SideBar.propTypes = {
    entities: PropTypes.array,
    hook: PropTypes.object.isRequired
}
