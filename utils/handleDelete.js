import EVENTS from "../../../utils/EVENTS";

export default function handleDelete(entries, hook, bookmarksHook) {
    const ee = !Array.isArray(entries) ? [entries] : entries
    if(bookmarksHook)
        bookmarksHook.removeBlock(ee)
    ee.forEach(id => {
        const files = hook.items.filter(i => (i.id === id) ||(i.parent && i.parent.includes(id) && !i.isFolder))
        const relatedFiles = files.map(i => i.registryID).filter(i => i)

        const relatedEntities = hook.entities.filter(e => {
            return relatedFiles.includes(e.mesh) || relatedFiles.includes(e.material)
        }).map(e => {
            const file = files.find(f => {
                return f.registryID === e.mesh || f.registryID === e.material
            })
            return {...e, file: file}
        })
        hook.setToDelete({relatedEntities, file: id, relatedFiles:  files.map(i => i.name)})
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