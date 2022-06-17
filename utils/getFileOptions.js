import {onCreate} from "./getDirectoryOptions"
import handleDelete from "./handleDelete"
import AsyncFS from "../../../templates/AsyncFS"
import FILE_TYPES from "../../../../../public/static/FILE_TYPES"
import FileSystem from "../../../utils/files/FileSystem"
import SCRIPT_TEMPLATE from "../../../templates/SCRIPT_TEMPLATE"


const {shell} = window.require("electron")
export default function getFileOptions(hook, setCurrentItem, bookmarksHook) {
    const check = async (path, ext) => {
        let n = path + ext
        let it = 0

        while (await document.fileSystem.assetExists(n)) {
            it++
            n = path + `(${it})` + ext
        }

        return n
    }
    return [

        // FOLDER
        {
            requiredTrigger: "data-folder",
            label: "Delete",
            icon: "delete",
            onClick: (node) => handleDelete(node.getAttribute("data-folder"), hook, bookmarksHook)
        },
        {
            requiredTrigger: "data-folder",
            label: "New Folder",
            icon: "create_new_folder",
            onClick: (node) => onCreate(node.getAttribute("data-folder"), hook).catch()
        },
        {
            requiredTrigger: "data-folder",
            label: "Rename",
            icon: "edit",
            onClick: (node) => {
                setCurrentItem(node.getAttribute("data-folder"))
            }
        },
        {
            requiredTrigger: "data-folder",
            label: "Open with explorer",
            icon: "open_in_new",
            onClick: (node) => {
                shell.showItemInFolder(hook.path + FileSystem.sep +  node.getAttribute("data-folder") + FileSystem.sep)
            }
        },

        // FILE
        {
            requiredTrigger: "data-file",
            label: "Rename",
            icon: "edit",
            onClick: (node) => {
                setCurrentItem(node.getAttribute("data-file"))
            }
        },
        {
            requiredTrigger: "data-file",
            label: "Delete",
            icon: "delete",
            onClick: (node) => handleDelete(node.getAttribute("data-file"), hook)

        },

        {
            requiredTrigger: "data-wrapper",
            label: "New Material",
            icon: "texture",
            onClick: async () => {
                let path = await check(hook.currentDirectory.id + FileSystem.sep + "New Material", ".material")
                document.fileSystem.writeAsset(path, JSON.stringify({}))
                    .then(() => {
                        hook.refreshFiles()
                    })
            }
        },

        {
            requiredTrigger: "data-wrapper",
            label: "New Folder",
            icon: "create_new_folder",
            onClick: async () => {

                let path = hook.currentDirectory.id + FileSystem.sep + "New folder"

                const existing = await document.fileSystem.foldersFromDirectory(hook.path + hook.currentDirectory.id)
                if (existing.length > 0)
                    path += " - " + existing.length

                const [e] = await AsyncFS.mkdir(hook.path + path, {})
                if (!e)
                    hook.refreshFiles().catch()
            }
        },
        {
            requiredTrigger: "data-wrapper",
            label: "Open with explorer",
            icon: "open_in_new",
            onClick: () => {
                shell.showItemInFolder(hook.path + FileSystem.sep +  hook.currentDirectory.id)
            }
        },

        {
            requiredTrigger: "data-wrapper",
            label: "New script",
            icon: "code",
            onClick: async () => {
                let path = await check(hook.currentDirectory.id + FileSystem.sep + "New script", FILE_TYPES.SCRIPT)

                await document.fileSystem.writeAsset(path, SCRIPT_TEMPLATE)
                hook.refreshFiles().catch()
            }
        },
    ]
}