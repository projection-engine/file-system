import PropTypes from "prop-types";
import EVENTS from "../../../pages/project/utils/utils/EVENTS";
import styles from "../styles/Control.module.css";
import {Button, Dropdown, DropdownOption, DropdownOptions, LoaderProvider, Modal} from "@f-ui/core";
import QuickAccessProvider from "../../../pages/project/utils/hooks/QuickAccessProvider";
import {useContext, useRef, useState} from "react";
import TerrainImporter from "./TerrainImporter";
import GLTFImporter from "./GLTFImporter";

const pathRequire = window.require('path')
const DEFAULT_TERRAIN = {
    heightScale: 200,
    keepNormals: true,
    keepTangents: true
}
export default function ImportHandler(props) {

    const fileRef = useRef()
    const folderRef = useRef()
    const load = useContext(LoaderProvider)
    const quickAccess = useContext(QuickAccessProvider)
    const [asHeightmap, setAsHeightMap] = useState(false)
    const [filesToImport, setFilesToImport] = useState([])
    const [asFolder, setAsFolder] = useState(true)
    const [settings, setSettings] = useState(DEFAULT_TERRAIN)

    const submit = (files, folder) => {
        if (!folder) {
            files.forEach(file => {
                setFilesToImport([])
                load.pushEvent(EVENTS.IMPORT_FILE)
                props.hook.fileSystem
                    .importFile(file, props.hook.path + (props.hook.currentDirectory.id ? props.hook.currentDirectory.id : ''), asHeightmap, settings, props.setAlert)
                    .then(res => {
                        load.finishEvent(EVENTS.IMPORT_FILE)
                        props.hook.refreshFiles()
                        quickAccess.refresh()
                    })
            })
        } else {
            load.pushEvent(EVENTS.IMPORT_FILE)
            const promises = files.map(file => {
                return new Promise(resolve => {
                    const folder = pathRequire.resolve(props.hook.path + '\\' + (props.hook.currentDirectory.id ? props.hook.currentDirectory.id : '') + '\\' + file.webkitRelativePath.replace(file.name, ''))
                    const relative = folder.split(pathRequire.sep)
                    let folderPromises = []
                    relative.forEach((p, i) => {
                        const currPath = relative.slice(0, i + 1).join(pathRequire.sep)
                        if (!props.hook.fs.existsSync(currPath)) {
                            folderPromises.push(new Promise(resolve1 => {
                                props.hook.fs.mkdir(currPath, () => {
                                    resolve1()
                                })
                            }))
                        }
                    })
                    Promise.all(folderPromises)
                        .then(() => {
                            props.hook.fileSystem
                                .importFile(file, folder, false, undefined, props.setAlert)
                                .then(() => {
                                    resolve()

                                })
                        })
                })
            })
            Promise.all(promises)
                .then(() => {
                    load.finishEvent(EVENTS.IMPORT_FILE)
                    props.hook.refreshFiles()

                })
        }

        setAsHeightMap(false)
        setFilesToImport([])
    }

    return (
        <>
            <input
                type={'file'}
                ref={fileRef}
                accept={['.png', '.jpeg', '.jpg', '.hdr', '.obj', '.gltf', '.glt', '.material', '.fbx']}
                multiple={true}
                onChange={e => {
                    setAsFolder(false)
                    const ext = e.target.files[0].name.split('.').pop()
                    if (!asHeightmap && ext !== 'gltf')
                        submit(Array.from(e.target.files))
                    else
                        setFilesToImport(Array.from(e.target.files))
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
                    setAsFolder(true)
                    if (!asHeightmap)
                        submit(Array.from(e.target.files), true)
                    else
                        setFilesToImport(Array.from(e.target.files))
                    e.target.value = "";
                }}
                style={{display: 'none'}}
            />

            <Modal className={styles.modal} styles={{height: asHeightmap ? 'fit-content' : undefined}}
                   open={filesToImport.length > 0} handleClose={() => null} blurIntensity={'1px'}>
                <div className={styles.importHeader}>{asHeightmap ? 'Import terrain' : 'Import GLTF'}</div>
                {!asHeightmap ?
                    <GLTFImporter
                        files={filesToImport}
                        settings={settings}
                        setSettings={setSettings}
                    />
                    :
                    <TerrainImporter
                        terrainSettings={settings}
                        setTerrainSettings={setSettings}
                        file={filesToImport[0]}
                    />
                }


                <div className={styles.buttonGroup}>
                    <Button
                        variant={'filled'}
                        className={styles.settingsButton}
                        styles={{'--fabric-accent-color': '#ff5555'}}
                        onClick={() => {
                            setFilesToImport([])
                            setAsHeightMap(false)
                        }}>
                        Cancel
                    </Button>
                    <Button
                        variant={'filled'}
                        styles={{'--fabric-accent-color': '#0095ff'}}
                        className={styles.settingsButton}
                        onClick={() => {
                            submit(filesToImport, asFolder)
                        }}>
                        Accept
                    </Button>
                </div>
            </Modal>
            <Dropdown
                styles={{borderRadius: '0 5px 5px 0', fontSize: '.7rem', border: 'none'}}
                className={styles.settingsButton} variant={"outlined"}>
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


ImportHandler.propTypes = {
    setAlert: PropTypes.func,
    hook: PropTypes.object.isRequired,
}
