import {useEffect, useMemo, useRef, useState} from "react"
import styles from "../styles/Item.module.css"
import handleDropFolder from "../utils/handleDropFolder"

export default function useItem(props) {
    const ref = useRef()

    useEffect(() => {
        if (props.type === 0)
            ref.current.setAttribute("data-folder", props.data.id)
        else
            ref.current.setAttribute("data-file", props.data.id)
    }, [props.type])

    const currentlyOnRename = useMemo(() => {
        return props.onRename === props.data.id
    }, [props.onRename])
    const [currentLabel, setCurrentLabel] = useState(props.data.name)
    useEffect(() => {
        setCurrentLabel(props.data.name)
    }, [props.data.name])
    const selected = useMemo(() => {
        return props.selected.includes(props.data.id)

    }, [props.selected])


    const onDragOver = e => {
        if (props.type === 0) {
            e.preventDefault()
            ref.current?.classList.add(styles.hovered)
        }
    }

    const onDragLeave = e => {
        if (props.type === 0) {
            e.preventDefault()
            ref.current?.classList.remove(styles.hovered)
        }
    }
    const onDrop = e => {
        e.preventDefault()
        e.currentTarget.parentNode.classList.remove(styles.hovered)
        handleDropFolder(e, props.data.id, () => null, props.hook)
    }

    useEffect(() => {
        ref.current?.addEventListener("drop", onDrop)
        ref.current?.addEventListener("dragleave", onDragLeave)
        ref.current?.addEventListener("dragover", onDragOver)

        return () => {
            ref.current?.removeEventListener("drop", onDrop)
            ref.current?.removeEventListener("dragleave", onDragLeave)
            ref.current?.removeEventListener("dragover", onDragOver)
        }
    }, [props.data, ref])
    const handleDrag = (event) => {
        if (event.ctrlKey) {
            const selected = props.selected.map(s => {
                return props.hook.items.find(i => i.id === s)
            }).filter(e => e && !e.isFolder && e.type === "mesh")

            event.dataTransfer.setData("text", JSON.stringify(selected.map(s => s.registryID)))
        } else
            event.dataTransfer.setData("text", JSON.stringify([props.type === 1 ? props.data.registryID : props.data.id]))

    }

    return {

        ref, handleDrag,
        currentlyOnRename,
        currentLabel, setCurrentLabel,
        selected
    }
}