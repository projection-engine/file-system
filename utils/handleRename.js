import AsyncFS from "../../../../components/AsyncFS";

export default async function handleRename(item, newName, hook, setCurrentItem, bookmarksHook) {
    if (item.isFolder) {
        const newNamePath = (item.parent ? item.parent + '\\' + newName : '\\' + newName)
        await hook.fileSystem
            .rename(hook.path + item.id, hook.path + newNamePath)

        if (item.id === hook.currentDirectory.id)
            hook.setCurrentDirectory(prev => {
                return {
                    ...prev,
                    id: newNamePath
                }
            })
        hook.refreshFiles()
        bookmarksHook.renameBookmark(item.id, newNamePath)
    } else {
        const nameToApply = newName + '.' + item.type
        if (newName !== item.name) {
            const targetPath = hook.path + (item.parent ? item.parent + '\\' : '\\') + nameToApply

            if (!(await AsyncFS.exists(targetPath))) {
                await hook
                    .fileSystem
                    .rename(hook.path + item.id, targetPath)
                hook.refreshFiles()
            } else
                hook.setAlert({
                    type: 'error',
                    message: 'Item already exists.'
                })
        }
        setCurrentItem(undefined)
    }
}