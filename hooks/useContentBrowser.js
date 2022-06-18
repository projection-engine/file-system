import {useContext, useState} from "react"
import FileSystem from "../../../utils/files/FileSystem"
import FilesProvider from "../../../providers/FilesProvider"

export default function useContentBrowser() {
    const [currentDirectory, setCurrentDirectory] = useState({id: FileSystem.sep})
    const [navHistory, setNavHistory] = useState([])
    const [navIndex, setNavIndex] = useState(0)
    const [toDelete, setToDelete] = useState({})
    const data = useContext(FilesProvider)

    return {
        ...data,
        toDelete,
        setToDelete,
        navIndex,
        returnDir:() => {
            if (navIndex > 0 && navHistory[navIndex - 1]) {
                setNavIndex(n => {
                    return n - 1
                })
                setCurrentDirectory(navHistory[navIndex])
            }
        },
        forwardDir:() => {
            if (navIndex < 10 && navHistory[navIndex + 1]) {
                setNavIndex(n => {
                    return n + 1
                })
                setCurrentDirectory(navHistory[navIndex])
            }
        },
        navHistory,
        setNavHistory,
        currentDirectory,
        setCurrentDirectory: v => {
            setNavHistory(prev => {
                const c = [...prev, v]
                if (c.length > 10) c.shift()
                setNavIndex(c.length -1 )
                return c
            })
            setCurrentDirectory(v)
        }
    }
}
