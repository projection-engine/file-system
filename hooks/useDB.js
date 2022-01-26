import React, {useEffect, useRef, useState} from "react";
import Folder from "../templates/Folder";
import {Dexie} from "dexie";
import loadData from "../utils/loadData";
import randomID from "../../../utils/randomID";
import cloneClass from "../../../utils/cloneClass";

export default function useDB(name, rootName, setAlert, projectID) {
    const [db, setDb] = useState()
    const [openModal, setOpenModal] = useState(false)
    const [ready, setReady] = useState(false)

    const ref = useRef()
    const uploadRef = useRef()
    const [onRename, setOnRename] = useState({})
    const [items, setItems] = useState([])
    const [currentDirectory, setCurrentDirectory] = useState(null)


    useEffect(() => {
        if (projectID !== undefined) {
            const database = new Dexie(name);

            database.open().then(e => {
                loadData(e, projectID).then(res => {
                    const firstFolder = res.find(f => f instanceof Folder && !f.parent)

                    if (!firstFolder) {
                        const newParent = randomID()
                        e.table('folder').add({
                            id: newParent,
                            name: 'Project',
                            creationDate: (new Date()).toDateString(),
                            parentId: undefined,
                            project: projectID
                        }).then(() => {
                            const n = new Folder('Project', undefined, newParent)

                            setItems([n])
                            setCurrentDirectory(n.id)
                            setReady(true)
                        }).catch()
                    } else {
                        setReady(true)
                        setItems(res)
                        setCurrentDirectory(firstFolder?.id)
                    }
                })
            }).catch(e => {
                if (e.name === "NoSuchDatabaseError") {
                    database.version(1).stores({
                        project: 'id, settings',
                        entity: 'id, linkedTo, project, blob',


                        file: 'id, project, name, creationDate, parentId, blob, type, mimetype, size',
                        folder: 'id, project, name, creationDate, parentId'
                    });
                    database.open().then(r => {
                        const newParent = randomID()
                        r.table('folder').add({
                            id: newParent,
                            name: 'Project',
                            creationDate: (new Date()).toDateString(),
                            parentId: undefined
                        }).then(() => {
                            const n = new Folder('Project', undefined, newParent)

                            setItems([n])
                            setCurrentDirectory(n.id)
                            setReady(true)
                        }).catch()
                    }).catch(() => {
                        setAlert({
                            type: 'error',
                            message: 'Could not load database.'
                        })
                    })
                }
            })

            setDb(database)
        }
    }, [projectID])

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
            size: file.size,
            project: projectID
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
                return [...prev].map(item => {
                    if (item.id === folder.id) {
                        const clone = cloneClass(item)
                        clone.name = newName
                        return clone
                    }
                    return item
                })
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
                        return [...prev].filter(f => f.id !== file.id)
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
        console.log('HERE')
        db.open()
        db.table('folder').add({
            id: folder.id,
            name: folder.name,
            creationDate: folder.creationDate.toDateString(),
            parentId: folder.parent,
            project: projectID
        }).then(res => {

            setItems(prev => {

                return [...prev, folder]
            })
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
        const folders = items.filter(i => !i.parent && i instanceof Folder && i.id !== folder.id)

        if (folders.length > 0 || (folder.parent !== undefined)) {
            const children = items.filter(i => i.parent === folder.id)
            children.forEach(c => {
                if (c instanceof Folder)
                    removeFolder(c)
                else
                    removeFile(c)
            })
            db.table('folder').delete(folder.id)
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
                })
                .catch()
        } else
            setAlert({
                type: 'info',
                message: 'Can\'t delete root folder.'
            })
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
    const moveFolder = (folderID, targetDir) => {
        db.open()
        db.table('folder').update(folderID, {parentId: targetDir}).then(res => {
            setItems(prev => {
                return prev.map(item => {
                    if (item.id === folderID)
                        item.parent = targetDir
                    return item
                })
            })
            setAlert({
                type: 'success',
                message: 'Folder moved'
            })
        }).catch()
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
        ready,
        db,
        moveFolder,
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
