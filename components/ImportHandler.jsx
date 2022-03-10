import PropTypes from "prop-types";
import EVENTS from "../../../services/utils/misc/EVENTS";
import styles from "../styles/Control.module.css";
import {Button, Dropdown, DropdownOption, DropdownOptions, LoaderProvider, Modal, ToolTip} from "@f-ui/core";
import QuickAccessProvider from "../../../services/hooks/QuickAccessProvider";
import {useContext, useRef, useState} from "react";
import ControlBar from "./ControlBar";
import getIcon from "../utils/visuals/getIcon";
import TerrainImporter from "./TerrainImporter";

const pathRequire = window.require('path')
const DEFAULT_TERRAIN = {
    heightScale: 200
}
export default function ImportHandler(props) {

    const fileRef = useRef()
    const folderRef = useRef()
    const load = useContext(LoaderProvider)
    const quickAccess = useContext(QuickAccessProvider)
    const [asHeightmap, setAsHeightMap] = useState(false)
    const [filesToImport, setFilesToImport] = useState([])
    const [asFolder, setAsFolder] = useState(true)
    const [terrainSettings, setTerrainSettings] = useState(DEFAULT_TERRAIN)


    const submit = () => {
        if (!asFolder) {
            const file = filesToImport[0]
            setFilesToImport([])
            load.pushEvent(EVENTS.IMPORT_FILE)
            props.hook.fileSystem
                .importFile(file, props.hook.path + (props.hook.currentDirectory.id ? props.hook.currentDirectory.id : ''), asHeightmap, terrainSettings)
                .then(res => {
                    load.finishEvent(EVENTS.IMPORT_FILE)
                    props.hook.refreshFiles()
                    quickAccess.refresh()
                })
        } else {
            load.pushEvent(EVENTS.IMPORT_FILE)
            const promises = filesToImport.map(file => {
                return new Promise(resolve => {
                    const folder = pathRequire.resolve(props.hook.path + '\\' + (props.hook.currentDirectory.id ? props.hook.currentDirectory.id : '') + '\\' + file.webkitRelativePath.replace(file.name, ''))

                    if (!props.hook.fs.existsSync(folder))
                        props.hook.fs.mkdir(folder, () => {
                            props.hook.fileSystem.importFile(file, folder, false)
                                .then(() => {
                                    resolve()

                                })
                        })
                    else
                        props.hook.fileSystem
                            .importFile(file, folder, false)
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
        }


        setAsHeightMap(false)
        setFilesToImport([])
    }

    return (
        <>
            <input
                type={'file'}
                ref={fileRef}
                accept={['.png', '.jpeg', '.jpg', '.hdr', '.gltf', '.glt', '.material']}
                multiple={true}
                onChange={e => {
                    setAsFolder(false)
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
                    setFilesToImport(Array.from(e.target.files))
                    e.target.value = "";
                }}
                style={{display: 'none'}}
            />

            <Modal className={styles.modal} styles={{height: asHeightmap ? 'fit-content' : undefined}} open={filesToImport.length > 0} handleClose={() => null}>
                <div className={styles.importHeader}>{asHeightmap ? 'Import terrain' : 'Files to import'}</div>
                {!asHeightmap ? <div className={styles.toImport}>
                    {filesToImport.map((f, i) => (
                        <div key={i + 'file-to-import'} className={styles.item}>
                            <div style={{width: '100%', display: 'flex', alignItems: 'center'}}>
                                {getIcon(f.type.split('/')[0] === 'image' ? 'pimg' : 'mesh', null, styles.icon)}

                                {f.name}
                            </div>
                            <ToolTip>
                                <div className={styles.toolTip}>
                                    <div>
                                        Name: {f.name}
                                    </div>
                                    <div>
                                        Size: {f.size ? (f.size < 100000 ? (f.size / 1000).toFixed(2) + 'KB' : (f.size / (10 ** 6)).toFixed(2) + ' MB') : 'NaN'}
                                    </div>
                                    <div>
                                        Type: {f.type}
                                    </div>
                                </div>
                            </ToolTip>
                            <div style={{textAlign: 'right', width: '100%'}}>
                                {f.size ? (f.size < 100000 ? (f.size / 1000).toFixed(2) + 'KB' : (f.size / (10 ** 6)).toFixed(2) + ' MB') : 'NaN'}
                            </div>
                        </div>
                    ))}
                </div>
                    :
                    <TerrainImporter submit={submit} terrainSettings={terrainSettings} setTerrainSettings={setTerrainSettings} file={filesToImport[0]}/>
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
                            submit()
                        }}>
                        Accept
                    </Button>
                </div>
            </Modal>
            <Dropdown styles={{fontSize: '.7rem'}} className={styles.settingsButton} variant={"outlined"}>
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


    hook: PropTypes.object.isRequired,


}
