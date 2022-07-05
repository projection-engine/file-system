import {useMemo} from "react"
import KEYS from "../../../engine/templates/KEYS"
import handleDelete from "../utils/handleDelete"
import FileSystem from "../../../utils/files/FileSystem"
import useHotKeys from "../../shortcuts/hooks/useHotKeys"
import FILE_TYPES from "../../../../../public/static/FILE_TYPES"

const {shell} = window.require("electron")
export default function useShortcuts(hook,  selected, setSelected, entities, internalID) {
    const actions = useMemo(() => {
        const sel = !selected[0] ? undefined : hook.items.find(i => i.id === selected[0])
        return [
            {
                disabled: hook.currentDirectory.id === FileSystem.sep,
                label: "Back",
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
                        if (sel.type === FILE_TYPES.SCRIPT.replace(".", ""))
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
                    handleDelete(s, hook, entities)
                }
            },
            {
                label: "Cut",
                require: [KEYS.ControlLeft, KEYS.KeyX],
                callback: () => {
                    alert.pushAlert("Cutting " + selected.length + " files", "info")
                    console.log(selected)
                    hook.setToCut(selected)
                }
            },
            {
                label: "Paste",
                require: [KEYS.ControlLeft, KEYS.KeyV],
                callback: () => hook.paste()
            }
        ]
    }, [selected, hook.currentDirectory,hook.toCut])
    useHotKeys({
        focusTargetLabel: "Content browser",
        focusTargetIcon: "folder",
        focusTarget: internalID,
        actions
    })
}