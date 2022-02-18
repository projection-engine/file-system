import EVENTS from "../../../pages/project/utils/misc/EVENTS";

export default function handleDelete(id, hook){

    hook.load.pushEvent(EVENTS.DELETE_FOLDER)
    hook.fs.rm(hook.path + '\\' + id, {recursive: true, force: true}, (e) => {
        hook.load.finishEvent(EVENTS.DELETE_FOLDER)
        if(hook.currentDirectory.id === id)
            hook.setCurrentDirectory({id: '\\'})
        hook.refreshFiles()
    })
}