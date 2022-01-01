import Item from "./Item";
import React from 'react'

export default class Folder extends Item{
    items = []
    constructor(name="New Folder", parent, id, creationDate) {
        super(name, parent, id, creationDate);
    }
    removeItem(item){
        item.parent = null;
        this.items = this.items.filter(i => i.id !== item.id)
    }
    addItem(newItem){
        newItem.parent = {
            id: this.id
        }
        this.items.push(newItem)
    }
}
