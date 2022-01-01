import FileClass from "../templates/File";
import React from 'react'

export default function handleImport (files, hook) {
    let f = files
    f.forEach((fi, i) => {
        let reader = new FileReader();
        reader.addEventListener('load', event => {
            const split = fi.name.split(/\.([a-zA-Z].+)$/)
            console.log(fi)
            const nFile = new FileClass(split[0], split[1], fi.size)
            hook.currentDirectory.addItem(nFile)
            hook.pushFile(nFile, event.target.result)

            if (i === f.length - 1)
                event.target.files = []
        });
        reader.readAsText(fi)
    })
}
