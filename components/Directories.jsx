import PropTypes from "prop-types";
import styles from '../styles/Directories.module.css'
import {LoaderProvider} from "@f-ui/core";
import React, {useContext, useMemo} from "react";
import TreeView from "../../../components/tree/TreeView";
import mapToView from "../utils/parsers/mapToView";
import getDirectoryOptions from "../utils/visuals/getDirectoryOptions";
import handleDropFolder from "../utils/handleDropFolder";
import handleRename from "../utils/handleRename";


export default function Directories(props) {
    const directoriesToRender = useMemo(() => {
        const toFilter = props.hook.items.filter(item => item.isFolder && !item.parent)
        return [{
            id: '\\',
            label: 'Assets',
            phantomNode: true,
            onClick: () => {
              props.hook.setCurrentDirectory('\\')
            },
            children: toFilter.map(f => {
                return mapToView(f, props.hook)
            }),

            icon: <span style={{fontSize: '1rem'}}
                        className={'material-icons-round'}>inventory_2</span>,
            attributes: {'data-root': 'root'},
            parent: undefined
        }]
    }, [props.hook.items])
    const load = useContext(LoaderProvider)

    const options = useMemo(() => {
        return getDirectoryOptions(props, load)
    }, [props, load])
    return (
        <div data-directories-wrapper={'true'} className={styles.wrapper}>

            <TreeView
                contextTriggers={[
                    'data-directories-wrapper',
                    'data-folder',
                    'data-root'
                ]}
                options={options}
                draggable={true}
                onDrop={(event, target) => handleDropFolder(event, target, props.setAlert, props.hook)}
                onDragLeave={(event) => event.preventDefault()}
                onDragOver={(event) => event.preventDefault()}
                onDragStart={(e, t) => e.dataTransfer.setData('text', JSON.stringify([t]))}
                selected={props.hook.currentDirectory.id}
                nodes={directoriesToRender}
                handleRename={(folder, newName) => handleRename(folder, newName, props.hook)}
            />

        </div>
    )
}

Directories.propTypes = {
    hook: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired
}
