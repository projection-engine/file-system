import Folder from "../templates/Folder";
import File from "../templates/File";
import React from 'react'
import {FILE_TYPES} from "../hooks/useDB";

export default async function loadData(data) {

    return data.map(f => {
        console.log(f)
        if (f.instanceOf === FILE_TYPES.FOLDER)
            return  new Folder(f.name, f.parent, f.id, new Date(f.creationDate))
        else
            return new File(f.name,  f.type, f.size, f.id, f.parent, new Date(f.creationDate), f.previewImage)
    })
}
