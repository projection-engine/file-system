import PropTypes from "prop-types"
import styles from "../styles/File.module.css"
import React, {useContext, useMemo} from "react"
import getIcon from "../utils/getIcon"
import useItem from "../hooks/useItem"
import ItemTooltip from "./ItemTooltip"
import FILE_TYPES from "../../../../../public/static/FILE_TYPES"
import FileSystem from "../../../utils/files/FileSystem"
import openFile from "../../../utils/openFile"
import OpenFileProvider from "../../../hooks/OpenFileProvider"

const {shell} = window.require("electron")
export default function File(props) {

    const {
        ref,
        currentlyOnRename,
        currentLabel,
        setCurrentLabel,
        selected, handleDrag
    } = useItem(props)
    const {openFiles, setOpenFiles, setOpenTab} = useContext(OpenFileProvider)
    const onDoubleClick = () => {
        if (props.type === 1) {
            if (props.data.type === "material")
                openFile(openFiles, setOpenTab, setOpenFiles, props.data.registryID, currentLabel, props.data.type)
            else if (props.data.type === FILE_TYPES.SCRIPT.replace(".", ""))
                shell.openPath(props.hook.path + FileSystem.sep + props.data.id).catch()
            else
                props.setSelected(props.data.id)
        } else {
            props.reset()
            props.hook.setCurrentDirectory(props.data)
        }
    }
    const icon = useMemo(() => {
        return getIcon({
            path: document.fileSystem.path + FileSystem.sep + "previews" +FileSystem.sep +  props.data.registryID + FILE_TYPES.PREVIEW,
            type: props.data.type ? "." + props.data.type : "folder",

            visualization: props.visualizationType,
            childrenQuantity: props.childrenQuantity
        })
    }, [props.data, props.visualizationType])

    return (

        <div
            ref={ref}
            onContextMenu={() => {
                props.setSelected(props.data.id)
            }}
            onDoubleClick={onDoubleClick}
            id={props.data.id}
            data-size={props.visualizationType}
            onDragStart={handleDrag}
            draggable={!currentlyOnRename}
            onClick={props.setSelected}
            style={{
                background: selected ? "var(--pj-accent-color)" : props.visualizationType === 2 ? (props.index % 2 === 0 ? "var(--pj-background-secondary)" : "var(--pj-background-tertiary)") : undefined
            }}
            className={styles.file}
        >

            {icon}
            {currentlyOnRename ?
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
