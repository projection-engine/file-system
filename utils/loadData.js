import Folder from "../templates/Folder";
import File from "../templates/File";
import React from 'react'

export default async function loadData(db) {
    let folders = await db.table('folder').toArray()
    let files = await db.table('file').toArray()

    let parsedFolders = folders.map(f => {
            return new Folder(f.name, null, f.id, new Date(f.creationDate))

        }),
        parsedFiles = files.map(f => {
            return new File(f.name, f.mimetype + '/' + f.type, f.size, f.id, undefined, new Date(f.creationDate))
        })


    folders.forEach(f => {
        const parsed = parsedFolders.find(dir => dir.id === f.id)
        const parent = parsedFolders.find(dir => dir.id === f.parentId)
        if (parent)
            parent.addItem(parsed)
    })

    files.forEach(f => {
        const parsed = parsedFiles.find(file => file.id === f.id)
        const parent = parsedFolders.find(dir => dir.id === f.parentId)
        if (parent)
            parent.addItem(parsed)
    })

    return [parsedFolders, parsedFiles]
}
