import PropTypes from "prop-types"
import styles from "../styles/File.module.css"
import React, {useEffect, useMemo, useState} from "react"
import getIcon from "../utils/getIcon"
import ItemTooltip from "./ItemTooltip"
import FILE_TYPES from "../../../../../public/static/FILE_TYPES"
import FileSystem from "../../../utils/files/FileSystem"
import handleDropFolder from "../utils/handleDropFolder"

const {shell} = window.require("electron")
export default function File(props) {
    const [currentLabel, setCurrentLabel] = useState(props.data.name)
    useEffect(() => setCurrentLabel(props.data.name), [props.data.name])
    const selected = useMemo(() => props.selected.includes(props.data.id), [props.selected])
    const icon = useMemo(() => {
        return getIcon({
            path: window.fileSystem.path + FileSystem.sep + "previews" +FileSystem.sep +  props.data.registryID + FILE_TYPES.PREVIEW,
            type: props.data.type ? "." + props.data.type : "folder",

            visualization: props.visualizationType,
            childrenQuantity: props.childrenQuantity
        })
    }, [props.data, props.visualizationType])

    return (
        <div
            onDragOver={(e) => {
                if (props.type === 0) {
                    e.preventDefault()
                    e.currentTarget.classList.add(styles.hovered)
                }
            }}
            onDragLeave={(e) => {
                e.preventDefault()
                e.currentTarget.classList.remove(styles.hovered)
            }}
            onDrop={e => {
                e.preventDefault()
                e.currentTarget.parentNode.classList.remove(styles.hovered)
                handleDropFolder(e, props.data.id, () => null, props.hook)
            }}
            onContextMenu={() => props.setSelected(props.data.id)}
            data-file={props.type === 0 ? undefined : props.data.id}
            data-folder={props.type !== 0 ? undefined : props.data.id}
            onDoubleClick={() => {
                if (props.type === 1) {
                    if (props.data.type === FILE_TYPES.SCRIPT.replace(".", ""))
                        shell.openPath(props.hook.path + FileSystem.sep + props.data.id).catch()
                    else
                        props.setSelected(props.data.id)
                } else {
                    props.reset()
                    props.hook.setCurrentDirectory(props.data)
                }
            }}
            id={props.data.id}
            data-size={props.visualizationType}
            onDragStart={(event) => {
                if (event.ctrlKey) {
                    const selected = props.selected.map(s => {
                        return props.hook.items.find(i => i.id === s)
                    }).filter(e => e && !e.isFolder && e.type === "mesh")
                    event.dataTransfer.setData("text", JSON.stringify(selected.map(s => s.registryID)))
                } else
                    event.dataTransfer.setData("text", JSON.stringify([props.type === 1 ? props.data.registryID : props.data.id]))
            }}
            draggable={!props.onRename === props.data.id}
            onClick={props.setSelected}
            style={{
                background: selected ? "var(--pj-accent-color)" : props.visualizationType === 2 ? (props.index % 2 === 0 ? "var(--pj-background-secondary)" : "var(--pj-background-tertiary)") : undefined
            }}
            className={styles.file}
        >

            {icon}
            {props.onRename === props.data.id ?
                <input
                    className={styles.input}
                    onKeyPress={key => {
                        if (key.code === "Enter")
                            props.submitRename(currentLabel)
                    }}
                    onBlur={() => {
                        props.submitRename(currentLabel)
                    }}
                    onChange={e => setCurrentLabel(e.target.value)}
                    value={currentLabel}
                />
                :
                <div className={[styles.label, styles.overflow].join(" ")}>
                    {currentLabel}
                </div>
            }
            <ItemTooltip
                childrenQuantity={props.childrenQuantity}
                data={props.data}
                currentLabel={currentLabel}
                type={props.type}
            />

        </div>


    )
}

File.propTypes = {
    index: PropTypes.number,
    visualizationType: PropTypes.number,
    childrenQuantity: PropTypes.number,
    reset: PropTypes.func,
    type: PropTypes.oneOf([0, 1]),
    data: PropTypes.object,
    selected: PropTypes.array,
    setSelected: PropTypes.func,
    hook: PropTypes.object,
    onRename: PropTypes.string,
    submitRename: PropTypes.func
}
