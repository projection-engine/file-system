import {onCreate} from "./getDirectoryOptions"
import handleDelete from "./handleDelete"
import AsyncFS from "../../../templates/AsyncFS"
import FILE_TYPES from "../../../../../public/project/glTF/FILE_TYPES"
import FileSystem from "../../../utils/files/FileSystem"

const template = `
class YourClassName{
    state = {} // Your system state here
    
    constructor(){
        // Do your initialization state here
    }
    
    execute(params){
        // Called every frame
        
        // TEMPLATES    
        this.eventTick(params)
        // Some key pressed (example with KeyA)
        if(params.pressedKeys.KeyA && !this.state.pressedKeyA){
                this.state.pressedKeyA = true
                this.onKeyDown(params)
        }
        else if(params.pressedKeys.KeyA && this.state.pressedKeyA)
            this.onHold(params)
                
        else if(!params.pressedKeys.KeyA && this.state.pressedKeyA){
            this.state.pressedKeyA = false
            this.onRelease(params)
       }
    }
    
    // Templates
    eventTick(params){
        // Do things here
    }
    onHold(params){
        // Do things here
    }
    onKeyDown(params){
        // Do things here
    }
    onRelease(params){
        // Do things here
    }
}
`
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

        // WRAPPER
        {
            requiredTrigger: "data-wrapper",
            label: "New UI Frame",
            icon: "wysiwyg",
            onClick: async () => {
                let path = await check(hook.currentDirectory.id + FileSystem.sep + "New UI Frame", ".ui")
                document.fileSystem.writeAsset(path, JSON.stringify({}))
                    .then(() => {
                        hook.refreshFiles()
                    })
            }
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
            label: "New Blueprint script",
            icon: "code",
            onClick: async () => {
                let path = await check(hook.currentDirectory.id + FileSystem.sep + "New script", FILE_TYPES.SCRIPT)

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
                    hook.refreshFiles()
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
            label: "New raw script",
            icon: "code",
            onClick: async () => {
                let path = await check(hook.currentDirectory.id + FileSystem.sep + "New script", ".flowRaw")

                document.fileSystem.writeAsset(path, template)
                    .then(() => {
                        hook.refreshFiles()
                    })
            }
        },
    ]
}