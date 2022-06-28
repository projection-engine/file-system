import PropTypes from "prop-types"
import styles from "../styles/Control.module.css"
import {Button, Icon} from "@f-ui/core"
import React, {useContext} from "react"
import {ENTITY_ACTIONS} from "../../../engine-extension/entityReducer"
import COMPONENTS from "../../../engine/templates/COMPONENTS"
import FileSystem from "../../../utils/files/FileSystem"
import importScene from "../../../utils/importer/importScene"
import FILE_TYPES from "../../../../../public/static/FILE_TYPES"
import EngineProvider from "../../../providers/EngineProvider"

export default function ImportHandler(props) {
    const [engine] = useContext(EngineProvider)
    return ( 
        <Button
            styles={{borderRadius: "0 5px 5px 0", fontSize: ".7rem", border: "none", width: "75px", gap: "4px"}}
            className={styles.settingsButton}
            variant={"filled"}
            onClick={async () => {
                const toImport = await window.fileSystem.openDialog()
                alert.pushAlert("Loading files", "info")
                if(toImport.filter(e => e.includes("gltf")).length > 0) {
                    alert.pushAlert( "Loading scene",  "info")
                    const result = await window.fileSystem.importFile(props.hook.path + props.hook.currentDirectory.id, toImport)
                    let newEntities = [], newMeshes = []
                    for(let i in result) {
                        const current = result[i]
                        for(let j in current.ids) {
                            const res = await window.fileSystem.readRegistryFile(current.ids[j])
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
                                        const preview = window.renderer.generateMeshPreview(e, mesh)
                                        window.fileSystem.writeFile( FileSystem.sep + "previews" + FileSystem.sep + mesh.id + FILE_TYPES.PREVIEW, preview).catch(er => console.error(er))
                                    }
                                }
                            }
                        }
                    }
                    engine.setMeshes(prev => [...prev, ...newMeshes])
                    engine.dispatchEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: newEntities})
                }
                else
                    await window.fileSystem.importFile(props.hook.path + props.hook.currentDirectory.id, toImport)
                alert.pushAlert("Files imported (" + toImport.length + ")", "success")
                props.hook.refreshFiles()
            }}
        >
            <Icon  styles={{fontSize: "1rem"}}>open_in_new</Icon>
                Import
        </Button>
    )
}


ImportHandler.propTypes = {
    hook: PropTypes.object.isRequired,
}
