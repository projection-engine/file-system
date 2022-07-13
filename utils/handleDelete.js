import FileSystem from "../../../utils/files/FileSystem"

export default function handleDelete(entries, hook) {
    const itemsToDelete = !Array.isArray(entries) ? [entries] : entries
    hook.removeBlock(itemsToDelete)
    const entities = window.renderer.entities

    for (let i = 0; i < itemsToDelete.length; i++) {
        const currentItem = itemsToDelete[i]
        const relatedFiles = hook.items
            .filter(item => (item.id === currentItem) || (item.parent && item.parent.includes(currentItem) && !item.isFolder))
            .map(i => i.registryID)
        const relatedEntities = entities
            .filter(e => relatedFiles.includes(e.mesh) || relatedFiles.includes(e.material))
            .map(e => ({
                ...e,
                file: relatedFiles.find(currentFile => currentFile === e.mesh || currentFile === e.material)
            }))
        hook.setToDelete({relatedEntities, file: currentItem})
    }
}

export function deleteData(id, hook) {
    return new Promise(resolve => {
        window.fileSystem.deleteFile("assets" + FileSystem.sep + id, {recursive: true, force: true}).then(() => {
            if (hook.currentDirectory.id === id)
                hook.setCurrentDirectory({id: FileSystem.sep})
            resolve(Object.keys(hook.toDelete).length > 0 ? [...hook.toDelete.relatedFiles, id] : [id])
        })
    })
}