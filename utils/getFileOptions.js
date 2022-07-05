import {onCreate} from "./getDirectoryOptions"
import handleDelete from "./handleDelete"
import AsyncFS from "../../../utils/AsyncFS"
import FILE_TYPES from "../../../../../public/static/FILE_TYPES"
import FileSystem from "../../../utils/files/FileSystem"
import SCRIPT_TEMPLATE from "../../../../static/misc/SCRIPT_TEMPLATE"


const {shell} = window.require("electron")
export default function getFileOptions(hook, setCurrentItem,  entities) {
    const check = async (path, ext) => {
        let n = path + ext
        let it = 0

        while (await window.fileSystem.assetExists(n)) {
            it++
            n = path + `(${it})` + ext
        }

        return n
    }
    return [
        // FOLDER
        {
            requiredTrigger: "data-folder",
            label: "Rename",
            onClick: (node) => {
                setCurrentItem(node.getAttribute("data-folder"))
            }
        },
        {
            requiredTrigger: "data-folder",
            label: "Delete",
            icon: "delete",
            onClick: (node) => handleDelete(node.getAttribute("data-folder"), hook, entities)
        },
        {divider: true, requiredTrigger: "data-folder"},
        {
            requiredTrigger: "data-folder",
            label: "New Folder",
            icon: "create_new_folder",
            onClick: (node) => onCreate(node.getAttribute("data-folder"), hook).catch()
        },

        {
            requiredTrigger: "data-folder",
            label: "Open with explorer",
            onClick: (node) => {
                shell.showItemInFolder(hook.path + FileSystem.sep +  node.getAttribute("data-folder") + FileSystem.sep)
            }
        },
        {divider: true, requiredTrigger: "data-folder"},
        {
            requiredTrigger: "data-folder",
            label: "Cut",
            onClick: (node) => hook.setToCut([node.getAttribute("data-folder")])
        },
        {
            requiredTrigger: "data-folder",
            label: "Paste",
            onClick: (node) => hook.paste(node.getAttribute("data-folder"))
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
            onClick: (node) => handleDelete(node.getAttribute("data-file"), hook, entities)

        },
        {divider: true, requiredTrigger: "data-file"},
        {
            requiredTrigger: "data-file",
            label: "Cut",
            onClick: (node) => hook.setToCut([node.getAttribute("data-file")])
        },
        {
            requiredTrigger: "data-file",
            label: "Paste",
            onClick: (node) => hook.paste(node.getAttribute("data-file"))
        },

        // WRAPPER
        {
            requiredTrigger: "data-wrapper",
            label: "Paste",
            onClick: () => hook.paste()
        },
        {divider: true, requiredTrigger: "data-wrapper"},
        {
            requiredTrigger: "data-wrapper",
            label: "Back",
            onClick: () => hook.returnDir()
        },
        {
            requiredTrigger: "data-wrapper",
            label: "Forward",
            onClick: () => hook.forwardDir()
        },
        {divider: true, requiredTrigger: "data-wrapper"},
        {
            requiredTrigger: "data-wrapper",
            label: "Refresh",
            icon: "refresh",
            onClick: () =>  {
                alert.pushAlert("Refreshing files",  "info")
                hook.refreshFiles().catch()
            }
        },
        {
            requiredTrigger: "data-wrapper",
            label: "Go to parent",
            onClick: () => { 
                if(hook.currentDirectory.id !== FileSystem.sep)
                    hook.goToParent()
            }
        },
        {divider: true, requiredTrigger: "data-wrapper"},
        {
            requiredTrigger: "data-wrapper",
            label: "New Folder",
            icon: "create_new_folder",
            onClick: async () => {
                let path = hook.currentDirectory.id + FileSystem.sep + "New folder"
                const existing = await window.fileSystem.foldersFromDirectory(hook.path + hook.currentDirectory.id)
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
        {divider: true, requiredTrigger: "data-wrapper"},
        {
            requiredTrigger: "data-wrapper",
            label: "New Material",
            icon: "texture",
            onClick: async () => {
                let path = await check(hook.currentDirectory.id + FileSystem.sep + "New Material", ".material")
                window.fileSystem.writeAsset(path, JSON.stringify({}))
                    .then(() => {
                        hook.refreshFiles()
                    })
            }
        },
        {
            requiredTrigger: "data-wrapper",
            label: "New script",
            icon: "code",
            onClick: async () => {
                let path = await check(hook.currentDirectory.id + FileSystem.sep + "New script", FILE_TYPES.SCRIPT)

                await window.fileSystem.writeAsset(path, SCRIPT_TEMPLATE)
                hook.refreshFiles().catch()
            }
        },
    ]
}