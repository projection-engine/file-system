import React, {useEffect, useRef, useState} from "react";
import Folder from "../templates/Folder";
import {Dexie} from "dexie";
import loadData from "../utils/loadData";
import randomID from "../../components/shared/utils/randomID";
import cloneClass from "../../components/shared/utils/cloneClass";

export default function useExplorer(name, rootName, setAlert) {
    const [db, setDb] = useState()
    const [openModal, setOpenModal] = useState(false)
    const ref = useRef()
    const uploadRef = useRef()
    const [onRename, setOnRename] = useState({})
    const [items, setItems] = useState([])
    const [currentDirectory, setCurrentDirectory] = useState()


    useEffect(() => {
        const database = new Dexie(name);

        database.open().then(e => {
            loadData(e).then(res => {
                const firstFolder = res.find(f => f instanceof Folder)
                if (!firstFolder) {
                    const newParent = randomID()
                    e.table('folder').add({
                        id: newParent,
                        name: 'New folder',
                        creationDate: (new Date()).toDateString(),
                        parentId: undefined
                    }).then(() => {
                        console.log('AQUI')
                        setItems([new Folder('New folder', undefined, newParent)])
                        setCurrentDirectory(newParent)
                    }).catch()
                } else {
                    setItems(res)
                    setCurrentDirectory(firstFolder)
                }
            })
        }).catch(e => {
            if (e.name === "NoSuchDatabaseError") {
                database.version(1).stores({
                    file: 'id, name, creationDate, parentId, blob, type, mimetype, size',
                    folder: 'id, name, creationDate, parentId'
                });
                database.open()
            }
        })

        setDb(database)
    }, [])

    const pushFile = (file, blob) => {
        db.open()
        setItems(prev => [...prev, file])
        db.table('file').add({
            id: file.id,
            name: file.name,
            creationDate: file.creationDate.toDateString(),
            parentId: file.parent,
            blob: blob,
            type: file.type,
            mimetype: file.mimetype,
            size: file.size
        }).then(res => {
            setAlert({
                type: 'success',
                message: file.type === 'material' ? 'Material created' : 'Item uploaded'
            })
        }).catch(res => {
            setAlert({
                type: 'Error',
                message: res.message
            })
        })
    }

    const renameFile = (file, newName) => {
        db.open()
        db.table('file').update(file.id, {name: newName}).then(res => {
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
                message: 'Item renamed'
            })
        }).catch()
    }

    const renameFolder = (folder, newName) => {
        db.open()
        db.table('folder').update(folder.id, {name: newName}).then(res => {
            setItems(prev => {
                const newItems = [...prev].map(item => {
                    if (item.id === folder.id) {
                        const clone = cloneClass(item)
                        clone.name = newName
                        return clone
                    }
                    return item
                })
                return newItems
            })
            setAlert({
                type: 'success',
                message: 'Folder renamed'
            })
        }).catch()
    }

    const removeFile = (file, updateState = true) => {

        db.table('file').delete(file.id)
            .then(r => {
                if (updateState) {
                    setItems(prev => {
                        let newItems = [...prev]
                        newItems.splice(newItems.findIndex(f => f.id === file.id), 1)
                        return newItems
                    })

                    setAlert({
                        type: 'success',
                        message: 'Item deleted'
                    })
                }
            })
            .catch()
    }
    const pushFolder = (folder) => {
        db.open()
        db.table('folder').add({
            id: folder.id,
            name: folder.name,
            creationDate: folder.creationDate.toDateString(),
            parentId: folder.parent
        }).then(res => {
            setItems([...items, folder])
            setAlert({
                type: 'success',
                message: 'Folder created'
            })
        }).catch(res => {
            setAlert({
                type: 'Error',
                message: res.message
            })
        })

    }
    const removeFolder = (folder) => {

        db.table('folder').delete(folder.id)
            .then(r => {
                setItems(prev => {
                    let newItems = [...prev]
                    newItems = newItems.map(item => {
                        if (item.id === folder.id)
                            return undefined
                        else if (item.parent === folder.id) {
                            removeFile(item, false)
                            return undefined
                        } else
                            return item
                    })
                    console.log(newItems)
                    return newItems.filter(f => f !== undefined)
                })

                if (currentDirectory === folder.id)
                    setCurrentDirectory(items.find(el => el instanceof Folder))
                setAlert({
                    type: 'success',
                    message: 'Folder deleted'
                })
            })
            .catch()
    }

    const getFileBlob = async (fileID) => {
        const f = await db.table('file').get(fileID)

        return f.blob
    }
    const getFile = async (file) => {
        return await db.table('file').get(file)
    }
    const duplicateFile = (fileID) => {
        getFileBlob(fileID).then(blob => {
            const file = items.find(i => i.id === fileID)
            file.id = randomID()
            pushFile(file, blob)
        })
    }
    const moveFile = (fileID, targetDir) => {
        db.open()
        db.table('file').update(fileID, {parentId: targetDir}).then(res => {
            setItems(prev => {
                return prev.map(item => {
                    if (item.id === fileID)
                        item.parent = targetDir
                    return item
                })
            })
            setAlert({
                type: 'success',
                message: 'Item moved'
            })
        }).catch()
    }

    return {
        db,
        moveFile,
        renameFolder,
        renameFile,
        getFileBlob,
        ref,
        currentDirectory,
        setCurrentDirectory,
        pushFile,
        pushFolder,
        removeFile,
        removeFolder,
        items,
        openModal,
        setOpenModal,
        uploadRef,
        onRename,
        setOnRename,
        rootName,
        getFile,
        duplicateFile
    }
}
