import React, {useContext, useEffect, useRef, useState} from "react";
import Folder from "../templates/Folder";

import QuickAccessProvider from "../../../pages/project/hook/QuickAccessProvider";
import LoadProvider from "../../../pages/project/hook/LoadProvider";
import EVENTS from "../../../pages/project/utils/misc/EVENTS";

const fs = window.require('fs')
const pathRequire = window.require('path')
export default function useDB(setAlert) {
    const [openModal, setOpenModal] = useState(false)
    const load = useContext(LoadProvider)
    const ref = useRef()
    const uploadRef = useRef()
    const [onRename, setOnRename] = useState({})
    const [initialized, setInitialized] = useState(false)
    const [items, setItems] = useState([new Folder('Assets', undefined, 'none')])
    const [currentDirectory, setCurrentDirectory] = useState()
    const quickAccess = useContext(QuickAccessProvider)
    const path = (quickAccess.fileSystem.path + '\\assets')


    useEffect(() => {

        if (!initialized) {
            refreshFiles()

            if (!fs.existsSync(quickAccess.fileSystem.path + '\\assetsRegistry\\'))
                fs.mkdirSync(quickAccess.fileSystem.path + '\\assetsRegistry\\')
        }
    }, [])

    const parsePath = (p, registryData) => {
        return new Promise(resolve => {
            fs.lstat(p, (e, stat) => {
                const split = p.split('\\')
                let parent = [...split]
                parent.pop()

                parent = parent.join('\\').replace(path, '')
                const currentPath = p.replace(path, '')
                if (stat.isDirectory())
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
                    if(!registryData.find(reg => {
                        return  reg.path === parsedPath || reg.path === currentPath
                    })?.id)
                        registryData.forEach(reg => {
                            console.log({
                                reg: reg.path,
                                p:parsedPath ,
                                curr:  currentPath,
                                comp:  reg.path === parsedPath,
                                compB:  reg.path === currentPath
                            })


                        })
                    resolve({
                        isFolder: false,
                        name: [...split].pop().split(/\.([a-zA-Z0-9]+)$/)[0],
                        type: p.split('.').pop(),
                        creationDate: new Date(stat.birthtime).toDateString(),
                        id: currentPath,
                        size: stat.size,
                        registryID: registryData.find(reg => {
                            return reg.path === parsedPath || reg.path === currentPath
                        })?.id,
                        parent: split[split.length - 2] === 'assets' ? undefined : parent
                    })
                }
            })
        })

    }


    const refreshFiles = () => {
        load.pushEvent(EVENTS.LOAD_FILES)

        let promises = [],
            creationPromises = [
                new Promise(resolve => {
                    quickAccess.fileSystem.readRegistry()
                        .then(res => {
                            resolve(res)
                        })
                })
            ]
        if (!fs.existsSync(path)) {
            creationPromises = [
                new Promise(resolve => fs.mkdir(path, () => resolve())),
                new Promise(resolve => fs.mkdir(path + '/Content', () => resolve())),
            ]
        }

        Promise.all(creationPromises)
            .then(registryData => {
                const rD = registryData.flat().filter(reg => reg !== undefined)
                quickAccess.fileSystem.dirStructure(path, (res) => {
                    res.forEach(f => {
                        promises.push(parsePath(f, rD))
                    })
                    Promise.all(promises)
                        .then(promiseRes => {

                            load.finishEvent(EVENTS.LOAD_FILES)

                            if (promiseRes.length > 0 && !initialized)
                                setCurrentDirectory(promiseRes[0])
                            if (!initialized)
                                setInitialized(true)
                            setItems(promiseRes.sort(function (a, b) {
                                if (a.name < b.name) return -1
                                if (a.name > b.name) return 1
                                return 0
                            }))


                        })
                })
            })
    }

    return {
        refreshFiles,
        fileSystem: quickAccess.fileSystem,
        path,
        load,
        ref,
        currentDirectory,
        setCurrentDirectory,
        items, setItems,
        openModal,
        setOpenModal,
        uploadRef,
        onRename,
        setOnRename, setAlert,
        fs
    }
}
