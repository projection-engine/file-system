export default function handleRename(item, newName, hook, setCurrentItem){

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

        const nameToApply = newName +  '.' + item.type

        if (newName !== item.name) {
            const targetPath = hook.path + (item.parent ? item.parent +'\\' : '\\') + nameToApply

            if(!hook.fs.existsSync(targetPath))
                hook
                    .fileSystem
                    .rename(hook.path + item.id, targetPath)
                    .then(error => {

                        hook.refreshFiles()
                    })
            else
                hook.setAlert({
                    type: 'error',
                    message: 'Item already exists.'
                })
        }
        setCurrentItem(undefined)
    }
}