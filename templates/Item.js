import randomID from "../utils/randomID";
import React from 'react'

export default class Item{
    name = ''
    parent = null
    id = randomID()
    creationDate = new Date()
    constructor(name, parent=null, id=this.id, creationDate=this.creationDate) {
        this.id = id ? id : this.id
        this.name = name.replaceAll('/', '-')
        this.parent = parent
        if(this.parent)
            this.path = `${this.parent.path}/${this.name}`
        else
            this.path = this.name

        this.creationDate = creationDate ? creationDate : this.creationDate
    }

    set parent(newParent){
        if(newParent !== this.parent) {
            const prevParent = this.parent;
            this.parent = newParent;

            if(prevParent) {
                prevParent.removeItem(this.name)
            }
            if(newParent)
                newParent.addItem(this)
        }
    }
}
