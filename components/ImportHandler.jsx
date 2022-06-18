import PropTypes from "prop-types"
import styles from "../styles/Control.module.css"
import {Button, Checkbox, Icon, Modal} from "@f-ui/core"
import React, {useContext, useState} from "react"
import EntitiesProvider from "../../../providers/FilesProvider"
import {ENTITY_ACTIONS} from "../../../engine-extension/entityReducer"
import COMPONENTS from "../../../engine/templates/COMPONENTS"
import FileSystem from "../../../utils/files/FileSystem"
import importScene from "../../../utils/importer/importScene"
import FILE_TYPES from "../../../../../public/static/FILE_TYPES"

const path = window.require("path")

const DEFAULT_TERRAIN = {
    heightScale: 200,
    keepNormals: true,
    keepTangents: true
}
export default function ImportHandler(props) {
    const [asHeightmap, setAsHeightMap] = useState(false)
    const [filesToImport, setFilesToImport] = useState([])
    const [settings, setSettings] = useState(DEFAULT_TERRAIN)
    const {engine} = useContext(EntitiesProvider)

    return (
        <>
            <Modal
                className={styles.modal}
                styles={{height: asHeightmap ? "fit-content" : undefined}}
                open={filesToImport.filter(e => e.includes("gltf")).length > 0} handleClose={() => null} blurIntensity={"1px"}>
                {filesToImport.map((p) => {
                    if (p.split(".").pop() === "gltf") {
                        const name = p.split(path.sep).pop()
                        return (
                            <div
                                key={p}
                                className={styles.toImport}
                                style={{gap: "4px"}}
                            >
                                <label className={styles.importHeader}>
                                    {name}
                                </label>
                                <div className={styles.input}>
                                    <Checkbox
                                        noMargin={true}
                                        width={"100%"}
                                        checked={!settings.keepNormals}
                                        label={"Reprocess normals"}
                                        handleCheck={() => {
                                            setSettings(prev => {
                                                return {...prev, keepNormals: !prev.keepNormals}
                                            })
                                        }}/>
                                </div>
                                <div className={styles.input}>
                                    <Checkbox
                                        noMargin={true}
                                        width={"100%"}
                                        checked={!settings.keepTangents}
                                        label={"Reprocess tangents"}
                                        handleCheck={() => {
                                            setSettings(prev => {
                                                return {...prev, keepTangents: !prev.keepTangents}
                                            })
                                        }}/>
                                </div>
                            </div>
                        )
                    }
                    return null
                })}
                <div className={styles.buttonGroup} style={{justifyContent: "flex-end"}}>
                    <Button
                        variant={"filled"}
                        className={styles.settingsButton}
                        styles={{"--pj-accent-color": "#ff5555", width: "100px"}}
                        onClick={() => {
                            setFilesToImport([])
                            setAsHeightMap(false)
                        }}>
                        Cancel
                    </Button>
                    <Button
                        variant={"filled"}
                        styles={{"--pj-accent-color": "#0095ff", width: "100px"}}
                        className={styles.settingsButton}
                        onClick={async () => {

                            alert.pushAlert( "Loading scene",  "info")
                            const result = await document.fileSystem.importFile(settings, props.hook.path + props.hook.currentDirectory.id, filesToImport)
                            let newEntities = [], newMeshes = []
                            for(let i in result) {
                                const current = result[i]
                                for(let j in current.ids) {
                                    const res = await document.fileSystem.readRegistryFile(current.ids[j])
                                    if (res) {
                                        const {
                                            meshes,
                                            entities
                                        } = await importScene(engine, res, true)
                                        newEntities.push(...entities)
                                        newMeshes.push(...meshes)
                                        for(let m in entities){
                                            const e = entities[m]
                                            if(e && e.components[COMPONENTS.MESH]) {
                                                const mesh = meshes.find(m => m.id === e.components[COMPONENTS.MESH].meshID)
                                                const preview = engine.renderer.generateMeshPreview(e, mesh)
                                                document.fileSystem.writeFile( FileSystem.sep + "previews" + FileSystem.sep + mesh.id + FILE_TYPES.PREVIEW, preview).catch(er => {console.log(er)})
                                            }
                                        }
                                    }
                                }
                            }
                            engine.setMeshes(prev => [...prev, ...newMeshes])
                            engine.dispatchEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: newEntities})
                            props.hook.refreshFiles()
                            alert.pushAlert("Files imported (" + filesToImport.length + ")", "success")
                            setFilesToImport([])
                        }}>
                        Accept
                    </Button>
                </div>
            </Modal>
            <Button
                styles={{borderRadius: "0 5px 5px 0", fontSize: ".7rem", border: "none", width: "75px", gap: "4px"}}
                className={styles.settingsButton}
                variant={"filled"}
                onClick={async () => {
                    const toImport = await document.fileSystem.openDialog()

                    if(toImport.filter(e => e.includes("gltf")).length > 0)
                        setFilesToImport(toImport)
                    else {
                        alert.pushAlert("Loading files", "info")
                        await document.fileSystem.importFile(settings, props.hook.path + props.hook.currentDirectory.id, toImport)
                        props.hook.refreshFiles()
                        alert.pushAlert("Files imported (" + filesToImport.length + ")", "success")
                        setFilesToImport([])
                    }
                }}
            >
                <Icon  styles={{fontSize: "1rem"}}>open_in_new</Icon>
                Import
            </Button>
        </>
    )
}


ImportHandler.propTypes = {
    hook: PropTypes.object.isRequired,
}
