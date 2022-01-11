import React from 'react'
import randomID from "../../utils/randomID";

export default class Item {
    name = ''
    parent = null
    id
    creationDate

    constructor(name, parent, id, creationDate) {
        this.id = id !== undefined ? id : randomID()
        this.name = name.replaceAll('/', '-')
        this.parent = parent
        this.creationDate = creationDate !== undefined ? creationDate : new Date()
    }

}
