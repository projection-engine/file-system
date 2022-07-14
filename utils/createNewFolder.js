import AsyncFS from "../../../libs/AsyncFS"
import FileSystem from "../../../libs/FileSystem"

export default async function onCreate(parent, hook) {
    const directories = await window.fileSystem.foldersFromDirectory(hook.path + parent)

    const getName = async (id) => {
        const index = directories.filter(d => {
            return d.split(FileSystem.sep )[d.split(FileSystem.sep).length - 1].includes("New folder")
        }).length
        let newID = id
        if (index > 0)
            newID += " - " + index

        while ((await AsyncFS.exists(hook.path + newID))) {
            newID = await getName(newID)
        }
        return newID
    }

    let id = getName(parent + FileSystem.sep + "New folder")
    const [e] = await AsyncFS.mkdir(hook.path + id)
    if (!e)
        hook.refreshFiles().catch()
}