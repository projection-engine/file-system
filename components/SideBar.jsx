import PropTypes from "prop-types"
import React, {useId, useMemo} from "react"
import styles from "../styles/SideBar.module.css"
import {Icon} from "@f-ui/core"
import handleDropFolder from "../utils/handleDropFolder"
import FileSystem from "../../../libs/FileSystem"

export default function SideBar(props) {
    const assets = useMemo(
        () => props.hook.items.filter(item => item.isFolder && !item.parent),
        [props.hook.items]
    )

    // const [ref, offset, maxDepth] = useInfiniteScroll()
    const internalID = useId()

    return (
        <div className={styles.wrapper}>
            <div className={styles.section}>
                <details className={styles.tree} open={true}>
                    <summary className={styles.summary}>
                        <Icon className={styles.iconDropdown}>arrow_drop_down</Icon>
                        <Icon styles={{fontSize: "1rem"}}>
							inventory_2
                        </Icon>
						Assets
                    </summary>
                    <div className={styles.content}>
                        <div
                            data-highlight={props.hook.currentDirectory.id === FileSystem.sep}
                            className={styles.folder}
                            onDragOver={e => {
                                e.preventDefault()
                                e.target.classList.add(styles.hovered)
                            }}
                            onDragLeave={e => {
                                e.preventDefault()
                                e.target.classList.remove(styles.hovered)
                            }}
                            onDrop={e => {
                                e.preventDefault()
                                e.target.classList.remove(styles.hovered)
                                handleDropFolder(e.dataTransfer.getData("text"), FileSystem.sep, props.hook)
                            }}
                            onClick={() => props.hook.setCurrentDirectory({id: FileSystem.sep})}
                        >
                            <Icon styles={{fontSize: "1.1rem"}}>arrow_upward</Icon>
							...
                        </div>
                        {assets.map((b, i) => (
                            <div
                                data-highlight={b.id === props.hook.currentDirectory.id}
                                className={styles.folder}
                                key={i + "-asset-" + internalID}

                                onDragOver={e => {
                                    e.preventDefault()
                                    e.target.classList.add(styles.hovered)
                                }}
                                onDragLeave={e => {
                                    e.preventDefault()
                                    e.target.classList.remove(styles.hovered)
                                }}
                                onDrop={e => {
                                    e.preventDefault()
                                    e.target.classList.remove(styles.hovered)
                                    handleDropFolder(e.dataTransfer.getData("text"), b.id, props.hook)
                                }}
                                onClick={() => props.hook.setCurrentDirectory(b)}
                            >
                                <Icon styles={{fontSize: "1.1rem", color: "var(--folder-color)"}}>
									folder
                                </Icon>
                                {b.name}
                            </div>
                        ))}
                    </div>
                </details>
            </div>
            <div className={styles.section}>
                <details className={styles.tree}>
                    <summary className={styles.summary}>
                        <Icon className={styles.iconDropdown}>arrow_drop_down</Icon>
                        <Icon styles={{fontSize: "1rem"}}>
							book
                        </Icon>
						Bookmarks
                    </summary>
                    <div className={styles.content}>
                        {props.hook.bookmarks.map((b, i) => (
                            <div
                                className={styles.folder}
                                key={i + "-bookmark-" + internalID}
                                onDragOver={e => {
                                    e.preventDefault()
                                    e.target.classList.add(styles.hovered)
                                }}
                                onDragLeave={e => {
                                    e.preventDefault()
                                    e.target.classList.remove(styles.hovered)
                                }}
                                onDrop={e => {
                                    e.preventDefault()
                                    e.target.classList.remove(styles.hovered)
                                    handleDropFolder(e.dataTransfer.getData("text"), b.id, props.hook)
                                }}
                                onClick={() => props.hook.setCurrentDirectory({...b, id: b.path})}
                            >

                                <Icon styles={{fontSize: "1.1rem", color: "var(--folder-color)"}}>
									folder
                                </Icon>
                                {b.name}
                            </div>
                        ))}
                    </div>
                </details>
            </div>
        </div>
    )
}

SideBar.propTypes = {
    hook: PropTypes.object.isRequired
}
