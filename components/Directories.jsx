import PropTypes from "prop-types";
import {Accordion, AccordionSummary, Button, LoaderProvider} from "@f-ui/core";
import React, {useContext, useMemo} from "react";
import TreeView from "../../../components/tree/TreeView";
import mapToView from "../utils/parsers/mapToView";
import getDirectoryOptions from "../utils/visuals/getDirectoryOptions";
import handleDropFolder from "../utils/handleDropFolder";
import handleRename from "../utils/handleRename";
import styles from '../styles/Directories.module.css'

export default function Directories(props) {
    const directoriesToRender = useMemo(() => {
        const toFilter = props.hook.items.filter(item => item.isFolder && !item.parent)
        return [{
            id: '\\',
            label: 'Assets',
            phantomNode: true,
            onClick: () => {
                props.hook.setCurrentDirectory({
                    id: '\\'
                })
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
        <div className={styles.wrapper}>
            <Accordion contentStyles={{height: '100%'}} className={styles.accordionWrapper}>
                <AccordionSummary className={styles.accordion}>
                    Assets
                </AccordionSummary>
                <TreeView
                    contextTriggers={[
                        'data-directories-wrapper',
                        'data-folder',
                        'data-root',
                        'data-self'
                    ]}
                    noBackground={true}
                    options={options}

                    draggable={true}

                    // dragIdentifier={'file-item'}
                    onDrop={(event, target) => handleDropFolder(event, target, props.setAlert, props.hook)}
                    onDragLeave={(event) => event.preventDefault()}
                    onDragOver={(event) => event.preventDefault()}
                    onDragStart={(e, t) => e.dataTransfer.setData('text', JSON.stringify([t]))}
                    selected={props.hook.currentDirectory.id}
                    nodes={directoriesToRender}
                    handleRename={(folder, newName) => handleRename(folder, newName, props.hook, undefined, props.bookmarksHook)}
                />
            </Accordion>
            <Accordion contentStyles={{height: '100%'}} className={styles.accordionWrapper}>
                <AccordionSummary className={styles.accordion}>
                    Bookmarks
                </AccordionSummary>
                <>
                    {props.bookmarksHook.bookmarks.length > 0 ? props.bookmarksHook.bookmarks.map((b, i) => (
                        <React.Fragment key={b.path + '-' + i}>
                        <Button className={styles.row} onClick={() => props.hook.setCurrentDirectory({id: b.path})}>
                            <span className={'material-icons-round'} style={{fontSize: '1.1rem'}}>source</span>
                            {b.path === '\\' ? 'Assets' : b.name}
                        </Button>
                        </React.Fragment>
                    )) : (
                        <div className={styles.empty}>
                            No bookmarks found.
                            <Button
                                className={styles.button}
                                onClick={() => {
                                    props.bookmarksHook.addBookmark(props.hook.currentDirectory.id)
                                }}>
                                <span className={'material-icons-round'}>star</span>
                                Add current directory.
                            </Button>
                        </div>
                    )}
                </>
            </Accordion>
        </div>
    )
}

Directories.propTypes = {
    bookmarksHook: PropTypes.object,
    hook: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired
}
