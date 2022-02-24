import PropTypes from "prop-types";
import styles from '../styles/Control.module.css'
import {Button, Dropdown, DropdownOption, DropdownOptions, LoaderProvider} from "@f-ui/core";
import React, {useContext, useRef, useState} from "react";

import Search from "../../../components/search/Search";
import EVENTS from "../../../services/utils/misc/EVENTS";
import QuickAccessProvider from "../../../services/hooks/QuickAccessProvider";

const pathRequire = window.require('path')
export default function ControlBar(props) {
    const fileRef = useRef()
    const folderRef = useRef()
    const load = useContext(LoaderProvider)
    const quickAccess = useContext(QuickAccessProvider)
    const [asHeightmap, setAsHeightMap] = useState(false)
    return (
        <>

            <input
                type={'file'}
                ref={fileRef}
                accept={['.png', '.jpeg', '.jpg', '.hdr', '.gltf', '.glt', '.material']}
                multiple={true}
                onChange={e => {
                    load.pushEvent(EVENTS.IMPORT_FILE)
                    const f = e.target.files[0]
                    props.hook.fileSystem
                        .importFile(f, props.hook.path + (props.hook.currentDirectory.id ? props.hook.currentDirectory.id : ''), asHeightmap)
                        .then(res => {

                            load.finishEvent(EVENTS.IMPORT_FILE)
                            props.hook.refreshFiles()
                            quickAccess.refresh()
                        })


                    setAsHeightMap(false)

                    e.target.value = "";
                }}
                style={{display: 'none'}}
            />

            <input
                type={'file'}
                ref={folderRef}
                accept={['.png', '.jpeg', '.jpg', '.hdr', '.gltf', '.glt', '.material']}
                directory=""
                webkitdirectory=""
                multiple={true}
                onChange={e => {
                    const f = Array.from(e.target.files)
                    load.pushEvent(EVENTS.IMPORT_FILE)
                    const promises = f.map(file => {
                        return new Promise(resolve => {
                            const folder = pathRequire.resolve(props.hook.path + '\\' + (props.hook.currentDirectory.id ? props.hook.currentDirectory.id : '') + '\\' + file.webkitRelativePath.replace(file.name, ''))
                            if (!props.hook.fs.existsSync(folder))
                                props.hook.fs.mkdir(folder, () => {
                                    props.hook.fileSystem.importFile(file, folder, f)
                                        .then(() => {
                                            resolve()

                                        })
                                })
                            else
                                props.hook.fileSystem
                                    .importFile(file, folder, f)
                                    .then(() => {
                                        resolve()

                                    })

                        })
                    })
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
                    variant={"outlined"}
                    disabled={props.path.length <= 1}
                    className={styles.settingsButton}

                    onClick={() => {
                        const found = props.hook.items.find(i => i.id === props.hook.currentDirectory.parent)
                        if (found)
                            props.hook.setCurrentDirectory(found)
                    }}
                >
                    <span className={'material-icons-round'}>arrow_upward</span>
                </Button>
                <Button className={styles.settingsButton} onClick={() => props.hook.refreshFiles()}
                        variant={"outlined"}>
                    <span className={'material-icons-round'}>refresh</span>
                </Button>
                <div className={styles.divider}/>
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
                <div className={styles.divider}/>
                <Search searchString={props.searchString} setSearchString={props.setSearchString} width={'50%'}/>
                <div className={styles.pathWrapper} style={{width: '100%'}}>
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

            <Dropdown styles={{fontSize: '.7rem'}} variant={"outlined"}>
                <span className={'material-icons-round'} style={{fontSize: '1rem'}}>open_in_new</span>
                Import
                <DropdownOptions>
                    <DropdownOption option={{
                        icon: <span className={'material-icons-round'}
                                    style={{fontSize: '1.2rem'}}>terrain</span>,
                        label: 'Terrain heightmap',
                        onClick: () => {
                            setAsHeightMap(true)
                            fileRef.current.click()
                        }
                    }}/>
                    <DropdownOption option={{
                        icon: <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>note_add</span>,
                        label: 'Files',
                        onClick: () => fileRef.current.click()
                    }}/>
                    <DropdownOption option={{
                        icon: <span className={'material-icons-round'}
                                    style={{fontSize: '1.2rem'}}>create_new_folder</span>,
                        label: 'Folder',
                        onClick: () => folderRef.current.click()
                    }}/>
                </DropdownOptions>
            </Dropdown>

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
