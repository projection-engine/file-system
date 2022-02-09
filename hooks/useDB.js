import React, {useContext, useEffect, useRef, useState} from "react";
import Folder from "../templates/Folder";

import QuickAccessProvider from "../../../components/db/QuickAccessProvider";
import LoadProvider from "../../../pages/project/hook/LoadProvider";
import EVENTS from "../../../pages/project/utils/misc/EVENTS";
import ProjectLoader from "../../../services/workers/ProjectLoader";

const fs = window.require('fs')
export default function useDB() {
    const [openModal, setOpenModal] = useState(false)
    const load = useContext(LoadProvider)
    const ref = useRef()
    const uploadRef = useRef()
    const [onRename, setOnRename] = useState({})
    const [initialized, setInitialized] = useState(false)
    const [items, setItems] = useState([new Folder('Assets', undefined, 'none')])
    const [currentDirectory, setCurrentDirectory] = useState()
    const quickAccess = useContext(QuickAccessProvider)
    const path = quickAccess.fileSystem.path + '/assets'
    const [entitiesToWatch, setEntitiesToWatch] = useState([])

    const onItemRename = (oldName, newName) => {
        console.trace(oldName)
        console.trace(newName)
        return new Promise((resolve) => {

            const newEntities = entitiesToWatch.map(e => {

                let newEntity = {...e.data}
                if (newEntity.components.MeshComponent && newEntity.components.MeshComponent.meshID.includes(oldName)) {
                    newEntity.components.MeshComponent.meshID = newEntity.components.MeshComponent.meshID.replace(oldName, newName)
                }

                if (newEntity.components.MaterialComponent && newEntity.components.MeshComponent.materialID?.includes(oldName))
                    newEntity.components.MaterialComponent.materialID = newEntity.components.MaterialComponent.materialID.replace(oldName, newName)

                if (newEntity.components.SkyboxComponent && newEntity.components.SkyboxComponent._imageID?.includes(oldName))
                    newEntity.components.SkyboxComponent._imageID = newEntity.components.SkyboxComponent._imageID.replace(oldName, newName)

                return {...e, data: newEntity}
            })

            Promise.all(newEntities.map(e => {

                return quickAccess.fileSystem.updateEntity(e.data)
            }))
                .then((res) => {
                    refreshEntities()
                    resolve()
                })

        })
    }
    const refreshEntities = () => {
        ProjectLoader.getEntities(quickAccess.fileSystem)
            .then(res => {
                setEntitiesToWatch(res.filter(e => e.type === 'entity' && (e.data.components.MeshComponent || e.data.components.SkyboxComponent || e.data.components.MaterialComponent)))
            })
    }

    useEffect(() => {

        if (load.events[EVENTS.PROJECT_SAVE] !== undefined || !initialized) {
            refreshEntities()
        }
    }, [load.events])
    const parsePath = (p) => {
        return new Promise(resolve => {
            fs.lstat(p, (e, stat) => {
                const split = p.split('\\')
                let parent = [...split]
                parent.pop()

                if (stat.isDirectory())
                    resolve(
                        {
                            isFolder: true,
                            name: [...split].pop(),
                            creationDate: new Date(stat.birthtime).toDateString(),
                            id: p,
                            parent: split[split.length - 2] === 'assets' ? undefined : parent.join('\\')
                        }
                    )
                else
                    resolve({
                        isFolder: false,
                        name: [...split].pop().split(/\.([a-zA-Z0-9]+)$/)[0],
                        type: p.split('.').pop(),
                        creationDate: new Date(stat.birthtime).toDateString(),
                        id: p,
                        size: stat.size,
                        parent: split[split.length - 2] === 'assets' ? undefined : parent.join('\\')
                    })
            });
        })

    }
    useEffect(() => {
        refreshFiles()
    }, [])

    const refreshFiles = () => {
        load.pushEvent(EVENTS.LOAD_FILES)
        let promises = [],
            creationPromises = []
        if (!fs.existsSync(path)) {
            creationPromises = [
                new Promise(resolve => fs.mkdir(path, () => resolve())),
                new Promise(resolve => fs.mkdir(path + '/Content', () => resolve()))
            ]
        }
        Promise.all(creationPromises)
            .then(() => {
                quickAccess.fileSystem.dirStructure(path, (res) => {
                    res.map(f => {
                        promises.push(parsePath(f))
                    })
                    Promise.all(promises)
                        .then(promiseRes => {

                            if (promiseRes.length > 0 && !initialized)
                                setCurrentDirectory(promiseRes[0])
                            if (!initialized)
                                setInitialized(true)
                            setItems(promiseRes.sort(function(a, b){
                                if(a.name < b.name) return -1
                                if(a.name > b.name) return 1
                                return 0
                            }))
                            load.finishEvent(EVENTS.LOAD_FILES)
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
        onItemRename,
        currentDirectory,
        setCurrentDirectory,
        items, setItems,
        openModal,
        setOpenModal,
        uploadRef,
        onRename,
        setOnRename
    }
}
