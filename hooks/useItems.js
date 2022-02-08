import {useEffect, useMemo, useRef, useState} from "react";

import getFileOptions from "../utils/parsers/getFileOptions";
import FileSystem from "../../../components/db/FileSystem";
import EVENTS from "../../../pages/project/utils/misc/EVENTS";

export default function useItems({hook, accept, searchString}) {
    const [currentItem, setCurrentItem] = useState()
    const [focusedElement, setFocusedElement] = useState()

    const filesToRender = useMemo(() => {
        return hook.items.filter(file => file.parent === hook.currentDirectory.id && (searchString.length > 0 ? file.name.toLowerCase().includes(searchString) : true))
    }, [hook.items, hook.currentDirectory.id, searchString])
    const ref = useRef()
    const onDragOver = e => e.preventDefault()

    const onMouseDown = e => {
        const elements = document.elementsFromPoint(e.clientX, e.clientY)
        const isChild = elements.find(e => e.getAttribute('data-file') !== null || elements.find(e => e.getAttribute('data-folder') !== null))

        if (!isChild)
            setFocusedElement(undefined)
    }
    const onDrop = e => {
        hook.load.pushEvent(EVENTS.LOAD_FILE)
        e.preventDefault()

        let files = Array.from(e.dataTransfer.items)
        if (files.length > 0) {
            files = files.filter(f => f.kind === 'file')
            files = files.map(f => f.getAsFile())
            files = files.filter(f => {
                let valid = true
                const extension = f.name.split(/\.([a-zA-Z0-9]+)$/)
                accept.forEach(a => {
                    valid = valid && extension.includes(a)
                })
                return valid
            })
            files = files.map(f => {
                return hook.fileSystem.importFile(f)
            })

            Promise.all(files)
                .then(r => {
                    hook.load.finishEvent(EVENTS.LOAD_FILE)
                })
        }
    }
    useEffect(() => {
        ref.current?.addEventListener('drop', onDrop)
        ref.current?.addEventListener('mousedown', onMouseDown)
        ref.current?.addEventListener('dragover', onDragOver)
        return () => {
            ref.current?.removeEventListener('drop', onDrop)
            ref.current?.removeEventListener('mousedown', onMouseDown)
            ref.current?.removeEventListener('dragover', onDragOver)
        }
    }, [ref, hook, accept, searchString])

    const options = useMemo(() => {
        return getFileOptions(setCurrentItem)
    }, [hook, accept, searchString])

    return {
        currentItem, setCurrentItem,
        focusedElement, setFocusedElement,
        filesToRender, ref,
        options
    }
}