import {useEffect, useMemo, useRef, useState} from "react";

import getFileOptions from "../utils/getFileOptions";

export default function useItems({hook, accept, searchString, bookmarksHook}) {
    const [currentItem, setCurrentItem] = useState()


    const filesToRender = useMemo(() => {
        if(hook.currentDirectory.id !== '\\')
            return hook.items
                .filter(file => file.parent === hook.currentDirectory.id && (searchString.length > 0 ? file.name.toLowerCase().includes(searchString) : true))
                .map(e => {

                    return {
                        ...e, children: e.isFolder ? hook.items.filter(i => {
                            return typeof i.parent === 'string' && i.parent === e.id
                        }).length : 0,

                    }
                })
        else
            return hook.items
                .filter(file => !file.parent && (searchString.length > 0 ? file.name.toLowerCase().includes(searchString) : true))
                .map(e => {
                    return {
                        ...e,
                        children: e.isFolder ? hook.items.filter(i => {
                            return typeof i.parent === 'string' && i.parent === e.id
                        }).length : 0,
                    }
                })
    }, [hook.items, hook.currentDirectory, searchString])
    const ref = useRef()
    const onDragOver = e => e.preventDefault()

    const onDrop = e => {
        hook.setAlert({
            type: 'info',
            message: 'Moving files.'
        })
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

            Promise.all(files).catch()
        }
    }
    useEffect(() => {
        ref.current?.addEventListener('drop', onDrop)
        ref.current?.addEventListener('dragover', onDragOver)
        return () => {
            ref.current?.removeEventListener('drop', onDrop)
            ref.current?.removeEventListener('dragover', onDragOver)
        }
    }, [ref, hook, accept, searchString])

    const options = useMemo(() => {
        return getFileOptions(hook, setCurrentItem, bookmarksHook)
    }, [hook, accept, searchString])


    return {
        currentItem, setCurrentItem,
        filesToRender, ref,
        options ,

    }
}