import {useContext, useRef, useState} from "react"
import FileSystem from "../../../libs/FileSystem"
import FilesProvider from "../../../context/FilesProvider"
import handleDropFolder from "../utils/handleDropFolder"

export default function useContentBrowser() {
    const [currentDirectory, setCurrentDirectory] = useState({id: FileSystem.sep})
    const [toDelete, setToDelete] = useState({})
    const data = useContext(FilesProvider)
    const history = useRef({
        data: [],
        index: -1
    })
    const [toCut, setToCut] = useState([])

    const setDir = (v) => {
        const historyData = history.current.data
        historyData.push(currentDirectory.id)
        if (historyData.length > 10) historyData.shift()
        history.current.index = historyData.length
        setCurrentDirectory(v)
    }
    
    return {
        ...data,
        setToCut,
        toDelete,
        setToDelete,
        currentDirectory,
        setCurrentDirectory: setDir,
        toCut,
        paste: (parent) => {
            console.log(toCut)
            if(toCut.length > 0){
                handleDropFolder(
                    [...toCut],
                    parent ? parent : currentDirectory.id,  
                    {
                        ...data,
                        setToCut,
                        toDelete,
                        setToDelete,
                        currentDirectory,
                        setCurrentDirectory: setDir,
                    }
                )
                setToCut([])
            }
        },
        returnDir:() => {
            if (history.current.index > 0 && history.current.data[history.current.index - 1]) {
                history.current.index -= 1
                setCurrentDirectory({
                    id: history.current.data[history.current.index]
                })
            }
        },
        forwardDir:() => {
            if (history.current.index < 10 && history.current.data[history.current.index + 1]) {
                history.current.index += 1

                setCurrentDirectory({
                    id: history.current.data[history.current.index]
                })
            }
        },
        goToParent: () => {
            const found = currentDirectory.id
            if (found) {
                const split = found.split(FileSystem.sep )
                split.pop()
                if (split.length === 1)
                    setDir({id: FileSystem.sep })
                else
                    setDir({id: split.join(FileSystem.sep)})
            }
        }
    }
}
