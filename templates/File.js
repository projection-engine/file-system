import Item from "./Item";
import React from 'react'
import randomID from "../../utils/randomID";

export default class File extends Item{
    size = 0
    type = ''
    mimetype = ''
    constructor(name, type, size, id = randomID(), parent=null, creationDate) {
        super(name, parent, id, creationDate);
        const split = type.split('/')

        this.size = size
        if(split.length === 2) {
            this.type = split[1]
            this.mimetype = split[0]
        }
        else
            this.type = type
    }
}
