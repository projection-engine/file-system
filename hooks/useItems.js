import {useEffect, useMemo, useRef, useState} from "react"

import getFileOptions from "../utils/getFileOptions"
import FileSystem from "../../../utils/files/FileSystem"

export default function useItems({hook, accept, searchString, bookmarksHook, fileType}) {
    const [currentItem, setCurrentItem] = useState()
    function map(arr){
        return   arr.map(e => {
            return {
                ...e, children: e.isFolder ? hook.items.filter(i => {
                    return typeof i.parent === "string" && i.parent === e.id
                }).length : 0,
            }
        })
    }

    const filesToRender = useMemo(() => {
        console.log(hook.items)
        let type = fileType?.split("")
        if(type) {
            type.shift()
            type= type.join("")
        }
        if(searchString || fileType)
            return  map(hook.items
                .filter(file => (searchString.length > 0 && file.name.toLowerCase().includes(searchString)  || type && file.type === type && !file.isFolder)))

        if(hook.currentDirectory.id !== FileSystem.sep )
            return map(hook.items
                .filter(file => file.parent === hook.currentDirectory.id))
        else
            return map(hook.items
                .filter(file => !file.parent))
    }, [hook.items, hook.currentDirectory, searchString, fileType])

    const ref = useRef()
    const onDragOver = e => e.preventDefault()

    const onDrop = e => {
        hook.setAlert({
            type: "info",
            message: "Moving files."
        })
        e.preventDefault()

        let files = Array.from(e.dataTransfer.items)
        if (files.length > 0) {
            files = files.filter(f => f.kind === "file")
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

            Promise.all(files).catch()
        }
    }
    useEffect(() => {
        ref.current?.addEventListener("drop", onDrop)
        ref.current?.addEventListener("dragover", onDragOver)
        return () => {
            ref.current?.removeEventListener("drop", onDrop)
            ref.current?.removeEventListener("dragover", onDragOver)
        }
    }, [ref, hook, accept, searchString])

    const options = useMemo(() => {
        return getFileOptions(hook, setCurrentItem, bookmarksHook)
    }, [hook, accept, searchString])

    return {
        currentItem, setCurrentItem,
        filesToRender, ref, options }
}