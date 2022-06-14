import {Icon} from "@f-ui/core"
import React from "react"

export default function mapToView(folder, hook, bookmarks) {
    const items = hook.items,
        children = bookmarks ? [] : items.filter(i => i.isFolder && typeof i.parent === "string" && i.parent === folder.id)

    return {
        id: bookmarks ? folder.path : folder.id,
        label: folder.name,
        onClick: () => hook.setCurrentDirectory(bookmarks ? {...folder, id: folder.path} : folder),
        children: children.map(i => mapToView(i, hook)),
        draggable: true,
        icon: <Icon styles={{fontSize: "1rem", color: "var(--folder-color)"}}>folder</Icon>,
        parent: folder.parent,
        isFolder: true
    }

}