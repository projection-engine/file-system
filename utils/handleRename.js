export default function handleRename(item, newName, hook){

    if(item.isFolder) {
        const newNamePath = (item.parent ? item.parent + '\\' + newName : '\\' + newName)
        hook.fileSystem
            .rename(hook.path + item.id, hook.path + newNamePath)
            .then(error => {
                if (item.id === hook.currentDirectory.id)
                    hook.setCurrentDirectory(prev => {
                        return {
                            ...prev,
                            id: newNamePath
                        }
                    })
                hook.refreshFiles()

            })
    }
    else{
        //TODO
    }
}