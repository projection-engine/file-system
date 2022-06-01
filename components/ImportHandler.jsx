import PropTypes from "prop-types"
import styles from "../styles/Control.module.css"
import {Button, Checkbox, Modal} from "@f-ui/core"
import QuickAccessProvider from "../../../utils/hooks/QuickAccessProvider"
import React, {useContext, useState} from "react"
import Entity from "../../../engine/basic/Entity"
import importMesh from "../../../utils/importer/importMesh"
import EntitiesProvider from "../../../utils/hooks/EntitiesProvider"
import {ENTITY_ACTIONS} from "../../../engine/useEngineEssentials"
import COMPONENTS from "../../../engine/templates/COMPONENTS"
import FolderComponent from "../../../engine/components/FolderComponent"
import {v4} from "uuid"
import FileSystem from "../../../utils/files/FileSystem"
import importScene from "../../../utils/importer/importScene"
import FILE_TYPES from "../../../../../public/project/glTF/FILE_TYPES"

const path = window.require("path")

const DEFAULT_TERRAIN = {
    heightScale: 200,
    keepNormals: true,
    keepTangents: true
}
export default function ImportHandler(props) {
    const {fileSystem} = useContext(QuickAccessProvider)
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
                        styles={{"--fabric-accent-color": "#ff5555", width: "100px"}}
                        onClick={() => {
                            setFilesToImport([])
                            setAsHeightMap(false)
                        }}>
                        Cancel
                    </Button>
                    <Button
                        variant={"filled"}
                        styles={{"--fabric-accent-color": "#0095ff", width: "100px"}}
                        className={styles.settingsButton}
                        onClick={async () => {
                            props.setAlert({message: "Loading scene", type: "info"})
                            const result = await fileSystem.importFile(settings, props.hook.path + props.hook.currentDirectory.id, filesToImport)
                            let newEntities = [], newMeshes = []
                            for(let i in result) {
                                const current = result[i]
                                for(let j in current.ids) {
                                    const res = await fileSystem.readRegistryFile(current.ids[j])
                                    if (res) {
                                        const {
                                            meshes,
                                            entities
                                        } = await importScene(fileSystem, engine, res, props.setAlert, true)
                                        newEntities.push(...entities)
                                        newMeshes.push(...meshes)
                                        for(let m in entities){
                                            const e = entities[m]
                                            if(e && e.components[COMPONENTS.MESH]) {
                                                const mesh = meshes.find(m => m.id === e.components[COMPONENTS.MESH].meshID)
                                                const preview = engine.renderer.generateMeshPreview(e, mesh)
                                                fileSystem.writeFile( FileSystem.sep + "previews" + FileSystem.sep + mesh.id + FILE_TYPES.PREVIEW, preview).catch(er => {console.log(er)})
                                            }
                                        }
                                    }
                                }
                            }
                            engine.setMeshes(prev => [...prev, ...newMeshes])
                            engine.dispatchEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: newEntities})
                            props.setAlert({message: "Scene loaded", type: "success"})
                            props.hook.refreshFiles()
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
                    const toImport = await fileSystem.openDialog()
                    if(toImport.filter(e => e.includes("gltf")).length > 0)
                        setFilesToImport(toImport)
                    else {
                        await fileSystem.importFile(settings, props.hook.path + props.hook.currentDirectory.id, toImport)
                        props.hook.refreshFiles()
                        setFilesToImport([])
                    }
                }}
            >
                <span className={"material-icons-round"} style={{fontSize: "1rem"}}>open_in_new</span>
                Import
            </Button>
        </>
    )
}


ImportHandler.propTypes = {
    setAlert: PropTypes.func,
    hook: PropTypes.object.isRequired,
}
