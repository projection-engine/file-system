import useHotKeys from "../../../../components/hot-keys/useHotKeys"
import {useContext, useMemo} from "react"
import KEYS from "../../../engine/templates/KEYS"
import handleDelete from "../utils/handleDelete"
import FileSystem from "../../../utils/files/FileSystem"
import openFile from "../../../utils/openFile"
import OpenFileProvider from "../../../hooks/OpenFileProvider"
const {shell} = window.require("electron")
export default function useShortcuts(hook, bookmarksHook, selected, setSelected) {
    const {openFiles, setOpenFiles, setOpenTab} = useContext(OpenFileProvider)

    const actions = useMemo(() => {
        const sel = !selected[0] ? undefined : hook.items.find(i => i.id === selected[0])
        return [
            {
                disabled: hook.currentDirectory.id === FileSystem.sep,
                label: "Return",
                require: [KEYS.Backspace],
                callback: () => {
                    const found = hook.currentDirectory.id
                    if (found) {
                        const split = found.split(FileSystem.sep )
                        split.pop()
                        if (split.length === 1)
                            hook.setCurrentDirectory({id: FileSystem.sep })
                        else
                            hook.setCurrentDirectory({id: split.join(FileSystem.sep)})
                    }
                }
            },
            {
                label: "Open " + (sel ? sel.name : ""),
                require: [KEYS.Enter],
                disabled: selected.length === 0 || sel?.type === "mesh",
                callback: () => {
                    if (!sel.isFolder) {
                        if (sel.type === "material" || sel.type === "flow" || sel.type === "ui")
                            openFile(openFiles, setOpenTab, setOpenFiles, sel.registryID, sel.name, sel.type)
                        else if (sel.type === "flowRaw")
                            shell.openPath(hook.path + FileSystem.sep + sel.id).catch()
                        else
                            setSelected([sel.id])
                    } else {
                        setSelected([])
                        hook.setCurrentDirectory(sel)
                    }
                }
            },
            {
                label: "Delete",
                require: [KEYS.Delete],
                disabled: selected.length === 0,
                callback: () => {
                    const s = [...selected]
                    setSelected([])
                    handleDelete(s, hook, bookmarksHook)
                }
            }
        ]
    }, [selected, hook.currentDirectory])
    useHotKeys({
        focusTargetLabel: "Content browser",
        focusTargetIcon: "folder",
        focusTarget: "content-browser",
        actions
    })
}