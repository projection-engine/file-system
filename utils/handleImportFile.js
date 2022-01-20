import FileClass from "../templates/File";
import React from 'react'
import {toDataURL} from "../../../core/utils/imageManipulation";
import coreParser from "../../../core/utils/gltf/parser/coreParser";
import Folder from "../templates/Folder";

export default function handleImportFile(files, hook) {
    files.forEach(fi => processFile(fi, hook))
}

export function handleImportFolder(files, hook) {
    let usedNames = []
    let folders = files
        .map(f => {
            const name = f.webkitRelativePath.replace(/\/(([a-zA-Z0-9_ ]|-)+)\.[a-zA-Z0-9]*$/, '')
            if (!usedNames.find(dir => dir.name === name)) {
                const newFolder = new Folder(name)

                usedNames.push({
                    name,
                    id: newFolder.id
                })
                return newFolder
            } else
                return undefined
        }).filter(f => f !== undefined)


    folders.map(f => {
        const split = f.name.split('/')

        if (split.length > 1) {
            split.pop()
            const folderNewName = f.name.split('/')[f.name.split('/').length - 1]
            if (split.length > 0) {
                const directParent = usedNames.find(p => p.name === split[split.length - 1])
                console.log(directParent, split[split.length - 1], usedNames)
                if (directParent) {
                    f.parent = directParent.id
                    f.name = folderNewName
                }
            }
        }
        else
           f.parent = hook.currentDirectory

        return f
    }).forEach(f => hook.pushFolder(f))

    const parsedFiles = files
        .map(f => {
            const folderName = f.webkitRelativePath.replace(/\/(([a-zA-Z0-9_ ]|-)+)\.[a-zA-Z0-9]*$/, '')
            const folderRef = usedNames.find(dir => dir.name === folderName)
            f.parent = folderRef.id
            return f
        })

    parsedFiles.forEach(fi => processFile(fi, hook, true))
}

function processFile(file, hook, attributedParent) {
    let reader = new FileReader();
    const split = file.name.split(/\.([a-zA-Z].+)$/)
    const nFile = new FileClass(split[0], split[1], file.size, undefined, attributedParent ? file.parent : hook.currentDirectory)
    if (split[1].includes('png') || split[1].includes('jpeg'))
        toDataURL(URL.createObjectURL(file), base64 => {
            hook.pushFile(nFile, base64)
        })
    else if (split[1].includes('gltf')) {
        reader.addEventListener('load', event => {
            const parsedData = coreParser(event.target.result)

            hook.pushFile(nFile, event.target.result)
        });
        reader.readAsText(file)

    } else {
        reader.addEventListener('load', event => {
            hook.pushFile(nFile, event.target.result)
        });
        reader.readAsText(file)
    }
    return undefined
}