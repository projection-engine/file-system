import PropTypes from "prop-types";
import styles from '../styles/Directories.module.css'
import ContextMenu from "../../../components/context/ContextMenu";
import React, {useContext, useMemo} from "react";
import TreeView from "../../../components/tree/TreeView";
import mapToView from "../utils/parsers/mapToView";
import EVENTS from "../../../pages/project/utils/misc/EVENTS";
import LoadProvider from "../../../pages/project/hook/LoadProvider";
import ThemeProvider from "../../../pages/project/hook/ThemeProvider";
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
    const load = useContext(LoadProvider)
    const theme = useContext(ThemeProvider)
    const options = useMemo(() => {
        return getDirectoryOptions(props, load)
    }, [props, load])
    return (
        <div data-directories-wrapper={'true'} className={styles.wrapper}>
            <ContextMenu
                options={options}
                triggers={[
                    'data-directories-wrapper',
                    'data-folder',
                    'data-root'
                ]} className={theme.backgroundStripesClass} styles={{paddingRight: '8px'}}>
                <TreeView
                    draggable={true}
                    onDrop={(event, target) => handleDropFolder(event, target, props.setAlert, props.hook)}
                    onDragLeave={(event) => event.preventDefault()}
                    onDragOver={(event) => event.preventDefault()}
                    selected={props.hook.currentDirectory.id}
                    nodes={directoriesToRender}
                    handleRename={(folder, newName) =>handleRename(folder, newName, props.hook)}
                />
            </ContextMenu>
        </div>
    )
}

Directories.propTypes = {
    hook: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired
}
