export default async function handleDropFolder(event, target, setAlert, hook) {

    const textData = event.dataTransfer.getData('text')

    if (target !== 'root') {

        let from = textData
        if (!from.includes('\\')) {

            const reg = await hook.fileSystem.readRegistryFile(from)

            if (reg)
                from = reg.path
            else {
                setAlert({
                    type: 'error',
                    message: 'Could not find file.'
                })
                return
            }

        }
        const to = target + '\\' + from.split('\\').pop()

        const toItem = hook.items.find(f => f.id === target)
        const fromItem = hook.items.find(f => {
            return f.id === from || (f.registryID === textData && f.registryID !== undefined)
        })
        if (from !== to && toItem && toItem.id !== from && fromItem && fromItem.parent !== to && toItem.isFolder) {
            hook.fileSystem
                .rename(hook.path + '\\' + from, hook.path + to)
                .then(error => {
                    if (from === hook.currentDirectory.id)
                        hook.setCurrentDirectory(prev => {
                            return {
                                ...prev,
                                id: to
                            }
                        })

                    hook.refreshFiles()
                })
        }
    } else if (textData.includes('\\')) {

        const newPath = hook.path + '\\' + textData.split('\\').pop()

        if (!hook.fs.existsSync(newPath))
            hook.fileSystem
                .rename(hook.path + '\\' + textData, newPath)
                .then(error => {
                    if (textData === hook.currentDirectory.id)
                        hook.setCurrentDirectory(prev => {
                            return {
                                ...prev,
                                id: newPath.replace(hook.path, '')
                            }
                        })

                    hook.refreshFiles()
                })
        else
            setAlert({
                type: 'error',
                message: 'Folder already exists.'
            })
    }
}