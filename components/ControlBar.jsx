import PropTypes from "prop-types";
import styles from '../styles/Control.module.css'
import {Button} from "@f-ui/core";
import React, {useContext, useRef} from "react";

import Search from "../../../components/search/Search";
import EVENTS from "../../../pages/project/utils/misc/EVENTS";
import LoadProvider from "../../../pages/project/hook/LoadProvider";
import ResizableBar from "../../../components/resizable/ResizableBar";
import QuickAccessProvider from "../../../pages/project/hook/QuickAccessProvider";

const pathRequire = window.require('path')
export default function ControlBar(props) {
    const fileRef = useRef()
    const folderRef = useRef()
    const load = useContext(LoadProvider)
    const quickAccess = useContext(QuickAccessProvider)

    return (
        <>

            <input
                type={'file'}
                ref={fileRef}
                accept={['.obj', '.png', '.jpeg', '.jpg', '.hdr', '.gltf', '.glt', '.material']}
                multiple={true}
                onChange={e => {
                    load.pushEvent(EVENTS.IMPORT_FILE)
                    const f = e.target.files[0]
                    props.hook.fileSystem
                        .importFile(f, props.hook.path + (props.hook.currentDirectory.id ? props.hook.currentDirectory.id : ''))
                        .then(res => {
                            load.finishEvent(EVENTS.IMPORT_FILE)
                            props.hook.refreshFiles()
                            quickAccess.refresh()
                        })
                    e.target.value = "";
                }}
                style={{display: 'none'}}
            />
            <input
                type={'file'}
                ref={folderRef}
                accept={['.obj', '.png', '.jpeg', '.jpg', '.hdr', '.gltf', '.glt', '.bin', '.material']}
                directory=""
                webkitdirectory=""
                multiple={true}
                onChange={e => {
                    const f = Array.from(e.target.files)
                    load.pushEvent(EVENTS.IMPORT_FILE)
                    const promises = f.map(file => {
                        return new Promise(resolve => {
                            const folder = pathRequire.resolve(props.hook.path +  '\\' + (props.hook.currentDirectory.id ? props.hook.currentDirectory.id : '') + '\\' + file.webkitRelativePath.replace(file.name, ''))
                            console.log(folder)
                            if (!props.hook.fs.existsSync(folder))
                                props.hook.fs.mkdir(folder, () => {
                                    props.hook.fileSystem.importFile(file, folder)
                                        .then(() => {
                                            resolve()

                                        })
                                })
                            else
                                props.hook.fileSystem
                                    .importFile(file, folder)
                                    .then(() => {
                                        resolve()

                                    })

                        })
                    })
                    console.log(promises)
                    Promise.all(promises)
                        .then(() => {
                            load.finishEvent(EVENTS.IMPORT_FILE)
                            props.hook.refreshFiles()

                        })
                    e.target.value = "";
                }}
                style={{display: 'none'}}
            />


            <div style={{display: 'flex', gap: '4px', width: '100%'}}>
                <Button
                    styles={{marginRight: '4px'}}
                    disabled={props.path.length <= 1}
                    className={styles.settingsButton}
                    variant={"minimal"}
                    onClick={() => {
                        const found = props.hook.items.find(i => i.id === props.hook.currentDirectory.parent)
                        if (found)
                            props.hook.setCurrentDirectory(found)
                    }}
                >
                    <span style={{fontSize: '1rem'}} className={'material-icons-round'}>arrow_upward</span>
                </Button>
                <Button className={styles.settingsButton} onClick={() => props.setVisualizationType(0)}
                        highlight={props.visualizationType === 0}>
                    <span className={'material-icons-round'}>grid_view</span>
                </Button>
                <Button className={styles.settingsButton} onClick={() => props.setVisualizationType(1)}
                        highlight={props.visualizationType === 1}>

                    <span className={'material-icons-round'}>view_comfy</span>
                </Button>
                <Button className={styles.settingsButton} onClick={() => props.setVisualizationType(2)}
                        highlight={props.visualizationType === 2}>
                    <span className={'material-icons-round'}>view_list</span>
                </Button>
                <Search searchString={props.searchString} setSearchString={props.setSearchString} width={'100px'}/>
                <ResizableBar type={'width'}/>
                <div className={styles.pathWrapper}>
                    {props.path.map((p, i) => (
                        <React.Fragment key={p.path}>
                            <Button className={styles.button}
                                    variant={"minimal-horizontal"}
                                    styles={{fontWeight: 'normal', minWidth: '60px'}}
                                    highlight={props.hook.currentDirectory.id === p.path}
                                    onClick={() => {
                                        const found = props.hook.items.find(i => i.id === p.path)
                                        if (found)
                                            props.hook.setCurrentDirectory(found)
                                        else
                                            props.hook.setCurrentDirectory({
                                                id: '\\'
                                            })
                                    }}>
                                <div className={styles.overflow}>
                                    {p.name}
                                </div>
                            </Button>
                            {i < props.path.length - 1 ?
                                <span className={'material-icons-round'}>chevron_right</span> : null}
                        </React.Fragment>
                    ))}
                </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                <Button onClick={() => fileRef.current.click()} className={styles.button}
                        variant={'minimal-horizontal'}>
                    <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>description</span>
                    Import file
                </Button>
                <Button onClick={() => folderRef.current.click()} className={styles.button}
                        variant={'minimal-horizontal'}>
                    <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>folder</span>
                    Import folder
                </Button>
            </div>
        </>
    )
}

ControlBar.propTypes = {
    visualizationType: PropTypes.number,
    setVisualizationType: PropTypes.func,


    searchString: PropTypes.string,
    setSearchString: PropTypes.func,
    path: PropTypes.arrayOf(PropTypes.object),

    hook: PropTypes.object.isRequired,
    accept: PropTypes.array,
    label: PropTypes.string,
    setHidden: PropTypes.func,
    hidden: PropTypes.bool
}
