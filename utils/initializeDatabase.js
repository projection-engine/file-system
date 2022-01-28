import {Dexie} from "dexie";
import loadData from "./loadData";
import Folder from "../templates/Folder";
import randomID from "../../../utils/randomID";

export default async function initializeDatabase(name) {
    const database = new Dexie(name);
    let exists = false
    try {
        exists = true
        await database.open()
    } catch (e) {
        exists = false
        if (e.name === "NoSuchDatabaseError")
            await database.version(1).stores({
                project: 'id, settings',
                entity: 'id, linkedTo, project, blob',
                file: 'id, project, name, creationDate, parentId, blob, type, mimetype, size',
                folder: 'id, project, name, creationDate, parentId'
            });
    }
    return [database, exists]
}