import FileSystem from "../../../utils/files/FileSystem"

export default function handleDelete(entries, hook,  entities) {
    const ee = !Array.isArray(entries) ? [entries] : entries
    hook.removeBlock(ee)
    ee.forEach(id => {
        const files = hook.items.filter(i => (i.id === id) || (i.parent && i.parent.includes(id) && !i.isFolder))
        const relatedFiles = files.map(i => i.registryID).filter(i => i)

        const relatedEntities = entities.filter(e => {
            return relatedFiles.includes(e.mesh) || relatedFiles.includes(e.material)
        }).map(e => {
            const file = files.find(f => {
                return f.registryID === e.mesh || f.registryID === e.material
            })
            return {...e, file: file}
        })
        hook.setToDelete({relatedEntities, file: id, relatedFiles: files.map(i => i.name)})
    })

}

export function deleteData(id, hook) {
    return new Promise(resolve => {
        window.fileSystem.deleteFile("assets" + FileSystem.sep + id, {recursive: true, force: true}).then(() => {
            if (hook.currentDirectory.id === id)
                hook.setCurrentDirectory({id: FileSystem.sep })
            resolve(Object.keys(hook.toDelete).length > 0 ? [...hook.toDelete.relatedFiles, id] : [id])
        })
    })
}