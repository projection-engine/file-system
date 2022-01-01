import randomID from "../utils/randomID";
import Item from "./Item";
import React from 'react'

export default class File extends Item{
    size = 0
    type = ''
    mimetype = ''
    constructor(name, type, size, id = randomID(), parent, creationDate) {
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
