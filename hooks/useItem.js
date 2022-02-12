import {useEffect, useMemo, useRef, useState} from "react";
import styles from "../styles/ItemCard.module.css";
import handleDropFolder from "../utils/handleDropFolder";

export default function useItem(props) {
    const ref = useRef()
    useEffect(() => {
        if (props.type === 0)
            ref.current.setAttribute('data-folder', props.data.id)
        else
            ref.current.setAttribute('data-file', props.data.id)
    }, [props.type])

    const currentlyOnRename = useMemo(() => {
        return props.onRename === props.data.id
    }, [props.onRename])
    const [currentLabel, setCurrentLabel] = useState(props.data.name)
    useEffect(() => {
        setCurrentLabel(props.data.name)
    }, [props.data.name])


    const onDoubleClick = () => {

        if (props.type === 1) {

            if (props.data.type === 'mesh' || props.data.type === 'material' || props.data.type === 'image')
                props.openEngineFile(props.data.registryID, currentLabel)
            else
                props.setSelected(props.data.id)
        } else
            props.hook.setCurrentDirectory(props.data)
    }

    const onDragOver = e => {
        if (props.type === 0) {
            e.preventDefault()
            ref.current?.classList.add(styles.hovered)
        }
    }
    const onClick = () => props.setFocusedElement(props.data.id)
    const onDragLeave = e => {
        if (props.type === 0) {
            e.preventDefault()
            ref.current?.classList.remove(styles.hovered)
        }
    }
    const onDrop = e => {
        e.preventDefault()
        e.currentTarget.parentNode.classList.remove(styles.hovered)
        handleDropFolder( e, props.data.id, () => null, props.hook)
    }

    useEffect(() => {
        ref.current?.addEventListener('drop', onDrop)
        ref.current?.addEventListener('click', onClick)
        ref.current?.addEventListener('dragleave', onDragLeave)
        ref.current?.addEventListener('dragover', onDragOver)
        ref.current?.addEventListener('dblclick', onDoubleClick)

        return () => {
            ref.current?.removeEventListener('drop', onDrop)
            ref.current?.removeEventListener('click', onClick)
            ref.current?.removeEventListener('dragleave', onDragLeave)
            ref.current?.removeEventListener('dragover', onDragOver)
            ref.current?.removeEventListener('dblclick', onDoubleClick)
        }
    }, [props.data, ref, props.openEngineFile])

    return {
        ref,
        currentlyOnRename,
        currentLabel, setCurrentLabel,

    }
}