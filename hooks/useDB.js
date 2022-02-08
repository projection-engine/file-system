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
    const [currentDirectory, setCurrentDirectory] = useState({

    })
    const quickAccess = useContext(QuickAccessProvider)
    const path = quickAccess.fileSystem.path + '/assets'


    const parsePath = (p) => {
       return new Promise(resolve => {
           fs.lstat(p, (e, stat) => {
               if(stat.isDirectory())
                   resolve(
                       {
                           isFolder: true,
                           name: p.split('/').pop,
                           creationDate: new Date(stat.birthtime).toDateString(),
                           id: p,
                           children: p.filter(c => c.includes(p)).map(c => parsePath(c))
                       }
                   )
               else
                   resolve({
                       isFolder: false,
                       name: p.split('/').pop,
                       type: p.split('.').pop(),
                       creationDate: new Date(stat.birthtime).toDateString(),
                       id: p,
                       size: stat.size
                   })
           });
       })

    }
    useEffect(() => {
        if (projectID !== undefined) {
            load.pushEvent(EVENTS.PROJECT_FILES)
            let promises = []

            quickAccess.fileSystem.dirStructure(path, ( res) => {
                res.map(f => {
                    promises.push(parsePath(f))
                })
            })

            Promise.all(promises)
                .then(res => {
                    if(res.length > 0)
                        setCurrentDirectory(res[0])
                    else
                        setCurrentDirectory(
                            {
                                isFolder: true,
                                name: '',
                                id: '/',
                                children: []
                            }
                        )
                        setItems(res)
                    load.finishEvent(EVENTS.PROJECT_FILES)
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
