import PropTypes from "prop-types";
import styles from '../../styles/Cards.module.css'
import React from "react";
import ItemCard from "./ItemCard";
import useItems from "../../hooks/useItems";
import ContextMenu from "../../../../components/context/ContextMenu";

export default function Cards(props) {
    const {
        currentItem, setCurrentItem,
        focusedElement, setFocusedElement,
        filesToRender, ref,
        options
    } = useItems(props)

    return (
        <div
            ref={ref}
            className={styles.content}
            style={{display: props.hidden ? 'none' : undefined}}
            data-folder-wrapper={props.hook.currentDirectory.id}
        >
            <ContextMenu
                options={options}
                onContext={(node) => {
                    if (node !== undefined && node !== null && (node.getAttribute('data-file') || node.getAttribute('data-folder'))) {
                        const attr = node.getAttribute('data-file') ? node.getAttribute('data-file') : node.getAttribute('data-folder')
                        setFocusedElement(attr)
                    }
                }}
                className={styles.filesWrapper}
                triggers={[
                    'data-folder-wrapper',
                    'data-file',
                    'data-folder'
                ]}
            >
                {filesToRender.length > 0 ?
                    filesToRender.map(child => (
                        <React.Fragment key={child.id}>
                            <ItemCard
                                variant={props.visualizationType === 0 ? 'big' : 'small'}
                                setFocusedElement={setFocusedElement}
                                focusedElement={focusedElement}
                                type={child.isFolder ? 0 : 1}
                                data={child}
                                childrenQuantity={child.children}
                                selected={props.selected}
                                setSelected={props.setSelected}
                                openEngineFile={props.openEngineFile}
                                hook={props.hook}
                                onRename={currentItem}
                                visualizationType={props.visualizationType}
                                submitRename={newName => {
                                    if (newName !== child.name) {
                                        const path = window.require('path')
                                        const newNamePath = (child.parent ? (child.parent + '\\') + newName + (child.isFolder ? '' : `.${child.type}`) : path.resolve(props.hook.fileSystem.path + '/assets/' + newName + (child.isFolder ? '' : `.${child.type}`)))

                                        props.hook.fileSystem.rename(child.id, newNamePath)
                                            .then(error => {
                                                if (child.id === props.hook.currentDirectory.id)
                                                    props.hook.setCurrentDirectory(prev => {
                                                        return {
                                                            ...prev,
                                                            id: newNamePath
                                                        }
                                                    })
                                                props.hook.refreshFiles()

                                            })
                                    }
                                    setCurrentItem(undefined)
                                }}
                            />
                        </React.Fragment>
                    ))

                    :
                    <div className={styles.empty}>
                        <span className={'material-icons-round'} style={{fontSize: '100px'}}>folder</span>
                        <div style={{fontSize: '.8rem'}}>
                            Empty folder
                        </div>
                    </div>}

            </ContextMenu>
        </div>
    )
}

Cards.propTypes = {
    visualizationType: PropTypes.number,


    searchString: PropTypes.string,
    selected: PropTypes.string,
    setSelected: PropTypes.func,
    openEngineFile: PropTypes.func.isRequired,
    accept: PropTypes.array,
    hook: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired
}
