import FileClass from "../templates/File";
import React from 'react'
import {toDataURL} from "../../../core/utils/imageManipulation";
import coreParser from "../../../core/utils/gltf/parser/coreParser";
import Folder from "../templates/Folder";
import loadObj from "../../../core/utils/loadObj";
import computeBoundingBox from "./computeBoundingBox";
import resizeImageToPreview from "./resizeImageToPreview";

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

                if (directParent) {
                    f.parent = directParent.id
                    f.name = folderNewName
                }
            }
        } else
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

    switch (split[1]) {
        case 'png':
        case 'jpeg':
        case 'jpg': {


            toDataURL(URL.createObjectURL(file), base64 => {
                resizeImageToPreview(base64, (b) => {
                    const nFile = new FileClass(split[0], split[1], file.size, undefined, attributedParent ? file.parent : hook.currentDirectory, undefined, b)
                    hook.pushFile(nFile, base64)
                })
            })
            break
        }
        case 'gltf': {
            const newFolder = new Folder(split[0], hook.currentDirectory)
            hook.pushFolder(newFolder)

            reader.addEventListener('load', event => {
                const parsedData = coreParser(event.target.result)
                const encodedMeshes = parsedData.nodes.map(m => {
                    const [min, max] = computeBoundingBox(parsedData.meshes[m.meshIndex].vertices)
                    const str = JSON.stringify({
                        ...parsedData.meshes[m.meshIndex],
                        ...m,
                        boundingBoxMax: max,
                        boundingBoxMin: min,
                    })
                    return encodeURI(str)
                })
                parsedData.nodes.forEach(n => {

                    hook.pushFile(new FileClass(n.name, 'mesh', encodedMeshes[n.meshIndex].split(/%..|./).length - 1, undefined, newFolder.id), encodedMeshes[n.meshIndex])
                })
            });
            reader.readAsText(file)
            break
        }
        case'obj': {
            reader.addEventListener('load', event => {
                const mesh = loadObj(event.target.result)
                const [min, max] = computeBoundingBox(mesh.vertices)

                const parsedData = {
                    mesh,
                    rotation: [0, 0, 0],
                    translation: [0, 0, 0],
                    scaling: [1, 1, 1],
                    boundingBoxMax:max ,
                    boundingBoxMin: min,
                }
                const encodedMesh = encodeURI(JSON.stringify(parsedData))
                hook.pushFile(new FileClass(split[0].name, 'mesh', encodedMesh.split(/%..|./).length - 1, undefined, hook.currentDirectory), encodedMesh)
            });

            reader.readAsText(file)
            break
        }
        default: {
            const nFile = new FileClass(split[0], split[1], file.size, undefined, attributedParent ? file.parent : hook.currentDirectory)
            reader.addEventListener('load', event => {
                hook.pushFile(nFile, event.target.result)
            });
            reader.readAsText(file)
            break
        }

    }
    return undefined
}