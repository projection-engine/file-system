import React, {useContext, useEffect, useRef, useState} from "react";
import Folder from "../templates/Folder";

import QuickAccessProvider from "../../../components/db/QuickAccessProvider";
import LoadProvider from "../../../pages/project/hook/LoadProvider";

import randomID from "../../../pages/project/utils/misc/randomID";
import EVENTS from "../../../pages/project/utils/misc/EVENTS";

const fs = window.require('fs')
export default function useDB(setAlert, projectID) {
    const [openModal, setOpenModal] = useState(false)
    const load = useContext(LoadProvider)
    const ref = useRef()
    const uploadRef = useRef()
    const [onRename, setOnRename] = useState({})
    const [items, setItems] = useState([new Folder('Assets', undefined, 'none')])
    const [currentDirectory, setCurrentDirectory] = useState({})
    const quickAccess = useContext(QuickAccessProvider)
    const path = quickAccess.fileSystem.path + '/assets'


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
                        name: [...split].pop(),
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
        if (projectID !== undefined) {
            load.pushEvent(EVENTS.PROJECT_FILES)
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
                                if (promiseRes.length > 0)
                                    setCurrentDirectory(promiseRes[0])

                                setItems(promiseRes)
                                load.finishEvent(EVENTS.PROJECT_FILES)
                            })
                    })
                })


        }
    }, [projectID])

    return {
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
        setOnRename
    }
}
