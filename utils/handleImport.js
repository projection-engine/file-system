import FileClass from "../templates/File";
import React from 'react'
import {toDataURL} from "../../../../core/utils/imageManipulation";

export default function handleImport(files, hook) {
    let f = files
    f.forEach((fi, i) => {
        let reader = new FileReader();
        reader.addEventListener('load', event => {
            const split = fi.name.split(/\.([a-zA-Z].+)$/)

            const nFile = new FileClass(split[0], split[1], fi.size)

            hook.currentDirectory.addItem(nFile)

            if (split[1].includes('png') || split[1].includes('jpeg'))
                toDataURL(event.target.result, base64 => hook.pushFile(nFile, base64))
            else
                hook.pushFile(nFile, event.target.result)

            if (i === f.length - 1)
                event.target.files = []
        });
        reader.readAsText(fi)
    })
}
