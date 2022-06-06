import {useMemo, useState} from "react"
import FileSystem from "../../../utils/files/FileSystem"

export default function useItems({hook, searchString,  fileType}) {
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



    return {
        currentItem, setCurrentItem,
        filesToRender
    }
}