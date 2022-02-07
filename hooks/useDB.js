import React, {useContext, useEffect, useRef, useState} from "react";
import Folder from "../templates/Folder";

import File from "../templates/File";
import EVENTS from "../../editor/utils/misc/EVENTS";
import LoadProvider from "../../editor/hook/LoadProvider";
import randomID from "../../editor/utils/misc/randomID";
import cloneClass from "../../editor/utils/misc/cloneClass";
import QuickAccessProvider from "../../../components/db/QuickAccessProvider";

export const FILE_TYPES = {
    FOLDER: 'FOLDER',
    FILE: 'FILE'
}
export default function useDB(rootName, setAlert, projectID) {
    const [openModal, setOpenModal] = useState(false)
    const [ready, setReady] = useState(false)
    const load = useContext(LoadProvider)
    const ref = useRef()
    const uploadRef = useRef()
    const [onRename, setOnRename] = useState({})
    const [items, setItems] = useState([new Folder('Assets', undefined, 'none')])
    const [currentDirectory, setCurrentDirectory] = useState(null)
    const quickAccess = useContext(QuickAccessProvider)
    const path = quickAccess.fileSystem.path + '/assets'

    useEffect(() => {
        if (projectID !== undefined) {
            load.pushEvent(EVENTS.PROJECT_FILES)

            const files = quickAccess.fileSystem
                .fromDirectory(path)
            const directories = quickAccess.fileSystem.foldersFromDirectory(quickAccess.fileSystem.path + '/asset')


        }
    }, [projectID, database])

    const pushItem = (item, blob) => {

        if (item instanceof Folder)

            database
                .postFile({
                    id: item.id,
                    name: item.name,
                    creationDate: item.creationDate.toDateString(),
                    parent: item.parent,
                    instanceOf: FILE_TYPES.FOLDER,
                    type: 'Folder',
                    size: 0,
                    project: projectID
                })
                .then(() => {
                    load.finishEvent(EVENTS.IMPORT_FILE)
                    setItems(prev => [...prev, item])
                    setAlert({
                        type: 'success',
                        message: 'Folder added.'
                    })

                })
                .catch(res => {
                    load.finishEvent(EVENTS.IMPORT_FILE)
                    setAlert({type: 'Error', message: res.message})
                })
        else
            database
                .postFileWithBlob({
                    id: item.id,
                    name: item.name,
                    creationDate: item.creationDate.toDateString(),
                    parent: item.parent,
                    instanceOf: FILE_TYPES.FILE,
                    type: item.type,
                    size: item.size,
                    project: projectID,
                    previewImage: item.preview
                }, blob)
                .then(() => {
                    load.finishEvent(EVENTS.IMPORT_FILE)
                    setItems(prev => [...prev, item])
                    setAlert({
                        type: 'success',
                        message: 'ItemCard added.'
                    })
                })
                .catch(res => {
                    load.finishEvent(EVENTS.IMPORT_FILE)
                    setAlert({type: 'Error', message: res.message})
                })

    }

    const renameFile = (file, newName) => {
        database
            .updateFile(file.id, {name: newName})
            .then((() => {
                setItems(prev => {
                    return prev.map(item => {
                        if (item.id === file.id) {
                            const clone = cloneClass(item)
                            clone.name = newName
                            return clone
                        }
                        return item
                    })
                })
                setAlert({
                    type: 'success',
                    message: 'ItemCard renamed'
                })
            }))
            .catch()
    }


    const removeFile = (file, updateState = true) => {
        database
            .deleteFile(file.id)
            .then(() => {
                if (updateState) {
                    setItems(prev => {
                        return [...prev].filter(f => f.id !== file.id)
                    })

                    setAlert({
                        type: 'success',
                        message: 'ItemCard deleted'
                    })
                }
            })
            .catch()
    }

    const removeFolder = (folder) => {

        const folders = items.filter(i => !i.parent && i instanceof Folder && i.id !== folder.id)

        if (folders.length > 0 || (folder.parent !== undefined)) {
            load.pushEvent(EVENTS.DELETE_FOLDER)
            const children = items.filter(i => i.parent === folder.id)
            children.forEach(c => {
                if (c instanceof Folder)
                    removeFolder(c)
                else
                    removeFile(c)
            })
            database.deleteFile(folder.id)
                .then(r => {
                    setItems(prev => {
                        return [...prev].filter(f => f.id !== folder.id)
                    })

                    if (currentDirectory === folder.id)
                        setCurrentDirectory(items.find(el => el instanceof Folder && el.id !== currentDirectory)?.id)
                    setAlert({
                        type: 'success',
                        message: 'Folder deleted'
                    })

                    load.finishEvent(EVENTS.DELETE_FOLDER)
                })
                .catch()
        } else {

            setAlert({
                type: 'info',
                message: 'Can\'t delete root folder.'
            })
        }
    }

    const getFile = async (file) => {
        return await database.getFileWithBlob(file.id)
    }

    const moveItem = (itemID, targetDir) => {
        database.updateFile(itemID, {parent: targetDir})
            .then(() => {
                setItems(prev => {
                    return prev.map(item => {
                        if (item.id === itemID)
                            item.parent = targetDir
                        return item
                    })
                })
                setAlert({
                    type: 'success',
                    message: 'ItemCard moved'
                })
            }).catch()
    }


    return {
        ready,
        database,
        moveFolder: moveItem,
        moveFile: moveItem,
        renameFolder: renameFile,
        renameFile,
        load,
        ref,
        currentDirectory,
        setCurrentDirectory,
        pushFile: pushItem,
        pushFolder: pushItem,
        removeFile,
        removeFolder,
        items,
        openModal,
        setOpenModal,
        uploadRef,
        onRename,
        setOnRename,
        rootName,
        getFile
    }
}
