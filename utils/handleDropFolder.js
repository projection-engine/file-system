import AsyncFS from "../../../utils/AsyncFS";
import FileSystem from "../../../utils/files/FileSystem";

const pathResolve = window.require('path')
export default async function handleDropFolder(event, target, setAlert, hook) {
    let entities = []
    try {
        entities = JSON.parse(event.dataTransfer.getData('text'))
    } catch (e) {
    }

    for (let i = 0; i < entities.length; i++) {
        const textData = entities[i]
        if (target !== FileSystem.sep) {
            let from = textData
            if (!from.includes(FileSystem.sep)) {

                const reg = await hook.fileSystem.readRegistryFile(from)

                if (reg) from = reg.path
                else {
                    setAlert({
                        type: 'error', message: 'Could not find file.'
                    })
                    return
                }

            }
            const to = target + FileSystem.sep + from.split(FileSystem.sep).pop()

            const toItem = hook.items.find(f => f.id === target)
            const fromItem = hook.items.find(f => {
                return f.id === from || (f.registryID === textData && f.registryID !== undefined)
            })
            if (from !== to && toItem && toItem.id !== from && fromItem && fromItem.parent !== to && toItem.isFolder) {
                hook.fileSystem
                    .rename(pathResolve.resolve(hook.path + FileSystem.sep + from), pathResolve.resolve(hook.path + to))
                    .then(error => {
                        if (from === hook.currentDirectory.id) hook.setCurrentDirectory(prev => {
                            return {
                                ...prev, id: to
                            }
                        })

                        hook.refreshFiles()
                    })
            }
        } else if (textData.includes(FileSystem.sep)) {
            const newPath = hook.path + FileSystem.sep + textData.split(FileSystem.sep).pop()
            if (!(await AsyncFS.exists(newPath))) hook.fileSystem
                .rename(pathResolve.resolve(hook.path + FileSystem.sep + textData), pathResolve.resolve(newPath))
                .then(error => {
                    if (textData === hook.currentDirectory.id) hook.setCurrentDirectory(prev => {
                        return {
                            ...prev, id: newPath.replace(hook.path, '')
                        }
                    })

                    hook.refreshFiles()
                })
            else setAlert({
                type: 'error', message: 'Folder already exists.'
            })
        }

    }
}