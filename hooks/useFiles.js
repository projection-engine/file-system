import {useContext, useEffect, useRef, useState} from "react"

import QuickAccessProvider from "../../../hooks/QuickAccessProvider"
import {AlertProvider} from "@f-ui/core"
import EntitiesProvider from "../../../hooks/EntitiesProvider"
import LoaderProvider from "../../../../components/loader/LoaderProvider"
import {getCall} from "../../../templates/AsyncFS"
import FileSystem from "../../../utils/files/FileSystem"

export default function useFiles() {
    const [openModal, setOpenModal] = useState(false)
    const load = useContext(LoaderProvider)
    const alert = useContext(AlertProvider)
    const uploadRef = useRef()
    const [onRename, setOnRename] = useState({})
    const [initialized, setInitialized] = useState(false)
    const [items, setItems] = useState([])
    const [currentDirectory, setCurrentDirectory] = useState({
        id: FileSystem.sep
    })
    const [navHistory, setNavHistory] = useState([])
    const [navIndex, setNavIndex] = useState(0)
    const [createTerrain, setCreateTerrain] = useState(false)
    const [toDelete, setToDelete] = useState({})
    const quickAccess = useContext(QuickAccessProvider)
    const path = (quickAccess.fileSystem.path + FileSystem.sep + "assets")
    const {entities, removeEntities} = useContext(EntitiesProvider)
    const [loading, setLoading] = useState(false)

    async function refreshFiles(){
        setLoading(true)
        quickAccess.refresh()
        if (!initialized) setInitialized(true)
        const done = await getCall("refresh-files", {pathName: path})
        setLoading(false)
        setItems(done)
    }
    
    useEffect(() => {
        if (!initialized)
            refreshFiles().catch()
    }, [])



    return {
        toDelete,
        setToDelete,
        removeEntities,
        refreshFiles,
        fileSystem: quickAccess.fileSystem,
        loading,
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

        path,
        load,
        currentDirectory,
        setCurrentDirectory: v => {
            setNavHistory(prev => {
                const c = [...prev, v]
                if (c.length > 10) c.shift()

                setNavIndex(c.length -1 )
                return c
            })

            setCurrentDirectory(v)
        },
        items,
        setItems,
        openModal,
        setOpenModal,
        uploadRef,
        onRename,
        setOnRename,
        setAlert: ({type, message}) => alert.pushAlert(message, type),
        entities,
        createTerrain,
        setCreateTerrain
    }
}
