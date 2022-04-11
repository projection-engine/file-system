import {useContext, useEffect, useMemo, useRef, useState} from "react";
import styles from "../styles/Item.module.css";
import handleDropFolder from "../utils/handleDropFolder";
import dragImageMulti from '../../../static/table.svg'
import dragImageSingle from '../../../static/file.svg'
import QuickAccessProvider from "../../../services/hooks/QuickAccessProvider";

export default function useItem(props) {
    const ref = useRef()
    const [images, setImages] = useState({
        single: new Image(),
        multi: new Image()
    })
    useEffect(() => {
        setImages(prev => {
            prev.single.src = dragImageSingle
            prev.multi.src = dragImageMulti

            return prev
        })
    }, [])
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
    const selected = useMemo(() => {
        return props.selected.includes(props.data.id)

    }, [props.selected])

    const onDoubleClick = () => {

        if (props.type === 1) {

            if (props.data.type === 'mesh' || props.data.type === 'material' || props.data.type === 'image'|| props.data.type === 'flow')
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
        ref.current?.addEventListener('dragleave', onDragLeave)
        ref.current?.addEventListener('dragover', onDragOver)
        ref.current?.addEventListener('dblclick', onDoubleClick)

        return () => {
            ref.current?.removeEventListener('drop', onDrop)
            ref.current?.removeEventListener('dragleave', onDragLeave)
            ref.current?.removeEventListener('dragover', onDragOver)
            ref.current?.removeEventListener('dblclick', onDoubleClick)
        }
    }, [props.data, ref, props.openEngineFile])
    const handleDrag = (event) => {
        if(event.ctrlKey){
            const selected = props.selected.map(s => {
                return props.hook.items.find(i => i.id === s)
            }).filter(e => e && !e.isFolder && e.type === 'mesh')


            event.dataTransfer.setDragImage(images.multi, 0, 0)
            event.dataTransfer.setData('text', JSON.stringify(selected.map(s => s.registryID)))
        }
        else {
            event.dataTransfer.setDragImage(images.single, 0, 0)
            event.dataTransfer.setData('text', JSON.stringify([props.type === 1 ? props.data.registryID : props.data.id]))
        }

    }

    const quickAccess = useContext(QuickAccessProvider)
    const preview = useMemo(() => {
        switch (props.data.type){
            case 'mesh':
                // TODO
                return
            case 'pimg':
                return quickAccess.images.find(m => m.registryID === props.data.registryID)?.preview
            case 'material':
                return quickAccess.materials.find(m => m.registryID === props.data.registryID)?.preview
            default:
                return quickAccess
        }
    }, [quickAccess.images])
    return {

        preview,
        ref, handleDrag,
        currentlyOnRename,
        currentLabel, setCurrentLabel,
        selected
    }
}