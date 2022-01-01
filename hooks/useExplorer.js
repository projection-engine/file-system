import React, {useEffect, useRef, useState} from "react";
import Folder from "../templates/Folder";
import {Dexie} from "dexie";
import loadData from "../utils/loadData";

export default function useExplorer(name, rootName) {
    const [db, setDb] = useState()

    const [directories, setDirectories] = useState([new Folder(rootName)])
    useEffect(() => {
        const database = new Dexie(name);

        database.open().then(e => {
            loadData(e).then(res => {
                if (res[0].length === 0)
                    e.table('folder').add({
                        id: directories[0].id,
                        name: directories[0].name,
                        creationDate: directories[0].creationDate.toDateString(),
                        parentId: undefined,
                        children: directories[0].items
                    }).catch()
                else {
                    setDirectories(res[0])
                    setCurrentDirectory(res[0][0])
                }
            })
        }).catch(e => {
            if (e.name === "NoSuchDatabaseError") {
                database.version(1).stores({
                    file: 'id, name, creationDate, parentId, blob, type, mimetype, size',
                    folder: 'id, name, creationDate, parentId, children'
                });
                database.open()
            }
        })

        setDb(database)
    }, [])

    const pushFile = (file, blob) => {
        db.open()
        currentDirectory.addItem(file)
        db.table('file').add({
            id: file.id,
            name: file.name,
            creationDate: file.creationDate.toDateString(),
            parentId: file.parent?.id,
            blob: blob,
            type: file.type,
            mimetype: file.mimetype,
            size: file.size
        }).then(res => {
            const current = directories.findIndex(e => e.id === file.parent.id)
            setDirectories(prev => {
                prev[current].addItem(file)
                return prev
            })
            setCurrentDirectory(directories[current])
            setAlert({
                type: 'success',
                message: file.type === 'material' ? 'Material created' : 'File uploaded'
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
            const current = directories.findIndex(e => e.id === file.parent.id)
            setDirectories(prev => {
                const index = prev[current].items.findIndex(f => f.id === file.id)
                prev[current].items[index].name = newName
                return prev
            })
            setCurrentDirectory(directories[current])
            setAlert({
                type: 'success',
                message: 'File renamed'
            })
        }).catch()
    }

    const renameFolder = (folder, newName) => {
        db.open()
        db.table('folder').update(folder.id, {name: newName}).then(res => {
            const current = directories.findIndex(e => e.id === folder.id)
            setDirectories(prev => {
                prev[current].name = newName
                return prev
            })
            setCurrentDirectory(directories[current])
            setAlert({
                type: 'success',
                message: 'Folder renamed'
            })
        }).catch()
    }


    const removeFile = (file) => {
        db.table('file').delete(file.id)
            .then(r => {
                const current = directories.findIndex(e => e.id === file.parent.id)
                setDirectories(prev => {
                    prev[current].removeItem(file)
                    return prev
                })
                setCurrentDirectory(directories[current])
                setAlert({
                    type: 'success',
                    message: 'File deleted'
                })
            })
            .catch()
    }
    const pushFolder = (folder) => {
        db.open()
        db.table('folder').add({
            id: folder.id,
            name: folder.name,
            creationDate: folder.creationDate.toDateString(),
            parentId: folder.parent?.id,
            children: folder.items
        }).then(res => {
            setDirectories([...directories, folder])
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

    const [alert, setAlert] = useState({
        type: undefined,
        message: undefined
    })
    const removeFolder = (folder) => {
        folder.items.forEach(i => {
            removeFile(i)
        })
        db.table('folder').delete(folder.id)
            .then(r => {
                setDirectories(prev => {
                    return prev.filter(f => f.id !== folder.id)
                })
                if(currentDirectory.id === folder.id)
                    setCurrentDirectory(directories[0])
                setAlert({
                    type: 'success',
                    message: 'Folder deleted'
                })
            })
            .catch()
    }
    const [openModal, setOpenModal] = useState(false)
    const ref = useRef()
    const uploadRef = useRef()
    const [onRename, setOnRename] = useState({})


    const getFileBlob = async (file) => {
        const f = await db.table('file').get(file)

        return f.blob
    }
    const [currentDirectory, setCurrentDirectory] = useState(directories[0])

    const moveFile = (fileID, targetDir) => {
        const targetDirIndex = directories.findIndex(f => f.id === targetDir)
        const targetFileIndex = currentDirectory.items.findIndex(f => f.id === fileID)
        const oldParentIndex = directories.findIndex(f => f.id === currentDirectory.items[targetFileIndex].parent.id)

        db.open()
        db.table('file').update(fileID, {parentId: targetDir}).then(res => {
            db.table('folder').update(directories[oldParentIndex].id, {children: directories[oldParentIndex].items.filter(i => i.id !== fileID)}).then(res => {
                db.table('folder').update(directories[targetDirIndex].id, {children: [...directories[targetDirIndex].items, fileID]}).then(res => {
                    setDirectories(prev => {
                        const i = currentDirectory.items[targetFileIndex]
                        if(i) {
                            prev[oldParentIndex].items =  directories[oldParentIndex].items.filter(f => f.id !== fileID)
                            prev[targetDirIndex].items = [...directories[targetDirIndex].items, i]
                        }

                        return prev
                    })
                    setCurrentDirectory(directories[oldParentIndex])
                    setAlert({
                        type: 'success',
                        message: 'File moved'
                    })
                }).catch()
            }).catch()
        }).catch()
    }
    return {
        moveFile,
        renameFolder,
        renameFile,
        alert,
        setAlert,
        getFileBlob,
        ref,
        currentDirectory,
        setCurrentDirectory,
        pushFile,
        pushFolder,
        removeFile,
        removeFolder,
        directories,
        openModal,
        setOpenModal,
        uploadRef,
        onRename,
        setOnRename,
        rootName
    }
}
