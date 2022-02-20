import EVENTS from "../../../services/utils/misc/EVENTS";

export default function handleDelete(id, hook) {
    const files = hook.items.filter(i => (i.id === id) ||(i.parent && i.parent.includes(id) && !i.isFolder))

    const relatedFiles = files.map(i => i.registryID)
    const relatedFilesIDs = files.map(i => i.id)
    const relatedEntities = hook.entities.filter(e => {
        return relatedFiles.includes(e.mesh) || relatedFiles.includes(e.material)
    }).map(e => {
        const file = files.find(f => {
            return f.registryID === e.mesh || f.registryID === e.material
        })
        return {...e, file: file}
    })


    if(relatedEntities.length > 0 || files.length > 0) {
        hook.setToDelete({relatedEntities, file: id, relatedFiles: relatedFilesIDs})
    }
    else
        deleteData(id, hook).then(toRemove => {
            hook.setItems(prev => {
                return prev.filter(p => !toRemove.includes(p.id))
            })
        })

}

export function deleteData(id, hook){
    return new Promise(resolve => {
        hook.load.pushEvent(EVENTS.DELETE_FOLDER)
        hook.fs.rm(hook.path + '\\' + id, {recursive: true, force: true}, (e) => {
            hook.load.finishEvent(EVENTS.DELETE_FOLDER)
            if (hook.currentDirectory.id === id)
                hook.setCurrentDirectory({id: '\\'})
            resolve(Object.keys(hook.toDelete).length > 0 ? [...hook.toDelete.relatedFiles, id] : [id])
        })
    })
}