import PropTypes from "prop-types";
import React, {useContext, useMemo} from "react";
import TreeView from "../../../../components/tree/TreeView";
import mapToView from "../utils/mapToView";
import getDirectoryOptions from "../utils/getDirectoryOptions";
import handleDropFolder from "../utils/handleDropFolder";
import handleRename from "../utils/handleRename";
import styles from '../styles/Directories.module.css'
import LoaderProvider from "../../../../components/loader/LoaderProvider";
import FileSystem from "../../../utils/files/FileSystem";

export default function SideBar(props) {

    const directoriesToRender = useMemo(() => {
        const toFilter = props.hook.items.filter(item => item.isFolder && !item.parent)
        return [{
            id: FileSystem.sep ,
            label: 'Assets',
            phantomNode: true,
            onClick: () => {
                props.hook.setCurrentDirectory({
                    id: FileSystem.sep
                })
            },
            children: toFilter.map(f => {
                return mapToView(f, props.hook)
            }),

            icon: <span style={{fontSize: '1rem'}}
                        className={'material-icons-round'}>inventory_2</span>,
            attributes: {'data-root': 'root'},
            parent: undefined
        },
            {
                id: 'bk',
                label: 'Bookmarks',
                phantomNode: true,

                children: props.bookmarksHook.bookmarks.map(f => {
                    return mapToView(f, props.hook, true)
                }),

                icon: <span style={{fontSize: '1rem'}}
                            className={'material-icons-round'}>star</span>,
                attributes: {'data-root': 'root'},
                parent: undefined
            }
        ]
    }, [props.hook.items, props.bookmarksHook.bookmarks])
    console.log(props.hook.currentDirectory)

    const load = useContext(LoaderProvider)

    const options = useMemo(() => {
        return getDirectoryOptions(props, load)
    }, [props, load])

    return (
       <>
           <div className={styles.wrapper}>
               <TreeView
                   contextTriggers={[
                       'data-directories-wrapper',
                       'data-folder',
                       'data-root',
                       'data-self'
                   ]}
                   options={options}
                   draggable={true}
                   onDrop={(event, target) => handleDropFolder(event, target, props.setAlert, props.hook)}
                   onDragLeave={(event) => event.preventDefault()}
                   onDragOver={(event) => event.preventDefault()}
                   onDragStart={(e, t) => e.dataTransfer.setData('text', JSON.stringify([t]))}
                   selected={props.hook.currentDirectory.id}
                   nodes={[directoriesToRender[0]]} className={styles.accordion}
                   handleRename={(folder, newName) => handleRename(folder, newName, props.hook, undefined, props.bookmarksHook)}
               />

           </div>
           <div className={styles.wrapper}>
               <TreeView
                   contextTriggers={[
                       'data-directories-wrapper',
                       'data-folder',
                       'data-root',
                       'data-self'
                   ]}
                   options={options}
                   draggable={true}
                   onDrop={(event, target) => handleDropFolder(event, target, props.setAlert, props.hook)}
                   onDragLeave={(event) => event.preventDefault()}
                   onDragOver={(event) => event.preventDefault()}
                   onDragStart={(e, t) => e.dataTransfer.setData('text', JSON.stringify([t]))}
                   selected={props.hook.currentDirectory.id}
                   nodes={[directoriesToRender[1]]} className={styles.accordion}
                   handleRename={(folder, newName) => handleRename(folder, newName, props.hook, undefined, props.bookmarksHook)}
               />

           </div>
       </>
    )
}

SideBar.propTypes = {
    bookmarksHook: PropTypes.object,
    hook: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired
}
