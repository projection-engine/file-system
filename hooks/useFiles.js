import React, {useContext, useEffect, useRef, useState} from "react";

import QuickAccessProvider from "../../../pages/project/utils/hooks/QuickAccessProvider";
import {AlertProvider, LoaderProvider} from "@f-ui/core";
import EntitiesProvider from "../../../pages/project/utils/hooks/EntitiesProvider";

const fs = window.require('fs')
const pathRequire = window.require('path')
export default function useFiles() {
    const [openModal, setOpenModal] = useState(false)
    const load = useContext(LoaderProvider)
    const alert = useContext(AlertProvider)
    const ref = useRef()
    const uploadRef = useRef()
    const [onRename, setOnRename] = useState({})
    const [initialized, setInitialized] = useState(false)
    const [items, setItems] = useState([])
    const [currentDirectory, setCurrentDirectory] = useState({
        id: '\\'
    })

    const [createTerrain, setCreateTerrain] = useState(false)
    const [toDelete, setToDelete] = useState({})
    const quickAccess = useContext(QuickAccessProvider)
    const path = (quickAccess.fileSystem.path + '\\assets')
    const {entities, removeEntities} = useContext(EntitiesProvider)


    useEffect(() => {
        if (!initialized) {
            refreshFiles()
        }
    }, [])

    const parsePath = (p, registryData) => {
        return new Promise(resolve => {
            fs.lstat(p, (e, stat) => {
                if (!e) {
                    const split = p.split('\\')
                    let parent = [...split]
                    parent.pop()

                    parent = parent.join('\\').replace(path, '')
                    const currentPath = p.replace(path, '')

                    if (stat && stat.isDirectory())
                        resolve(
                            {
                                isFolder: true,
                                name: [...split].pop(),
                                creationDate: new Date(stat.birthtime).toDateString(),
                                id: currentPath,

                                parent: split[split.length - 2] === 'assets' ? undefined : parent
                            }
                        )
                    else {

                        const parsedPath = pathRequire.resolve(path + currentPath).replace(path + '\\', '')

                        resolve({
                            isFolder: false,
                            name: [...split].pop().split(/\.([a-zA-Z0-9]+)$/)[0],
                            type: p.split('.').pop(),
                            fileType: '.' + p.split('.').pop(),
                            creationDate: new Date(stat.birthtime).toDateString(),
                            id: currentPath,
                            size: stat.size,
                            registryID: registryData.find(reg => {
                                return reg.path === parsedPath || reg.path === currentPath
                            })?.id,
                            parent: split[split.length - 2] === 'assets' ? undefined : parent
                        })
                    }
                } else
                    resolve()
            })
        })

    }


    const refreshFiles = () => {
        quickAccess.refresh()
        let promises = [],
            creationPromises = [
                new Promise(resolve => {
                    quickAccess.fileSystem.readRegistry()
                        .then(res => {
                            resolve(res)
                        })
                })
            ]

        Promise.all(creationPromises)
            .then(registryData => {
                const rD = registryData.flat().filter(reg => reg !== undefined)
                quickAccess.fileSystem.dirStructure(path, (res) => {
                    res.forEach(f => {
                        promises.push(parsePath(f, rD))
                    })
                    Promise.all(promises)
                        .then(promiseRes => {
                            if (!initialized)
                                setInitialized(true)

                            setItems(promiseRes.filter(p => p).sort(function (a, b) {
                                if (a.name < b.name) return -1
                                if (a.name > b.name) return 1
                                return 0
                            }))
                        })
                })
            })
    }
    const [navHistory, setNavHistory] = useState([])
    const [navIndex, setNavIndex] = useState(0)
    useEffect(() => {
        if(navHistory.length > 0)
        setNavIndex(navHistory.length - 1)
    }, [navHistory])

    const returnDir = () => {
        if (navIndex > 0 && navHistory[navIndex -1]) {

            setNavIndex(n => {
                return n - 1
            })
            setCurrentDirectory(navHistory[navIndex])
        }
    }
    const forwardDir = () => {
        if (navIndex < 10 && navHistory[navIndex + 1]) {
            setNavIndex(n => {
                return n + 1
            })
            setCurrentDirectory(navHistory[navIndex])
        }
    }
    return {
        toDelete, setToDelete,
        removeEntities,
        refreshFiles,
        fileSystem: quickAccess.fileSystem,

        navIndex,
        returnDir,
        forwardDir,

        navHistory,
        setNavHistory,

        path,
        load,
        ref,
        currentDirectory,
        setCurrentDirectory: v => {
            setNavHistory(prev => {
                const c = [...prev, v]
                if (c.length > 10)
                    c.shift()
                return c
            })
            setCurrentDirectory(v)
        },
        items, setItems,
        openModal,
        setOpenModal,
        uploadRef,
        onRename,
        setOnRename,
        setAlert: ({type, message}) => alert.pushAlert(message, type),
        fs,
        entities,
        createTerrain, setCreateTerrain
    }
}
