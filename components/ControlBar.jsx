import PropTypes from "prop-types";
import styles from '../styles/Control.module.css'
import {Button, Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";
import React, {useMemo} from "react";
import Search from "../../../components/search/Search";
import ImportHandler from "./ImportHandler";

export default function ControlBar(props) {
    const disabled = useMemo(() => {
        return {
            backwards: props.hook.navIndex === 0,
            forward: props.hook.navIndex === 9 || props.hook.navHistory[props.hook.navIndex + 1] === undefined
        }
    }, [props.hook.navHistory, props.hook.navIndex])

    const starred = useMemo(() => {
        return props.bookmarksHook.bookmarks.find(b => b.path === props.hook.currentDirectory.id) !== undefined
    }, [props.hook.currentDirectory, props.bookmarksHook.bookmarks])
    return (
        <div className={styles.wrapper} style={{border: props.hidden ? 'none' : undefined}}>
            <div className={styles.buttonGroup}>
                <Button
                    disabled={disabled.backwards}
                    className={styles.settingsButton}
                    styles={{borderRadius: '5px 0 0 5px'}}
                    onClick={() => props.hook.returnDir()}
                >
                    <span className={'material-icons-round'}>arrow_back</span>
                </Button>
                <Button
                    disabled={disabled.forward}
                    styles={{borderRadius: 0}}
                    className={styles.settingsButton}
                    onClick={() => props.hook.forwardDir()}
                >
                    <span className={'material-icons-round'} style={{transform: 'rotate(180deg)'}}>arrow_back</span>
                </Button>
                <Button

                    className={styles.settingsButton}
                    styles={{borderRadius: 0}}
                    onClick={() => {
                        const found = props.hook.currentDirectory.id
                        if (found) {
                            const split = found.split('\\')
                            split.pop()
                            if (split.length === 1)
                                props.hook.setCurrentDirectory({id: '\\'})
                            else
                                props.hook.setCurrentDirectory({id: split.join('\\')})
                        }
                    }}
                >
                    <span className={'material-icons-round'}
                          style={{transform: 'rotate(180deg)'}}>subdirectory_arrow_right</span>
                </Button>
                <Button
                    className={styles.settingsButton}
                    styles={{borderRadius: '0 5px 5px 0', border: 'none'}}
                    onClick={() => props.hook.refreshFiles()}
                >
                    <span className={'material-icons-round'}>sync</span>
                </Button>
            </div>
            <Button
                styles={{border: 'none'}}
                className={styles.settingsButton}
                onClick={() => {
                    const hook = props.hook
                    let path = hook.currentDirectory.id + '\\New folder'

                    const existing = hook.fileSystem.foldersFromDirectory(hook.path + hook.currentDirectory.id)
                    if (existing.length > 0)
                        path += ' - ' + existing.length

                    hook.fs.mkdir(hook.path + path, {}, () => {
                        hook.refreshFiles()
                    })

                }}

            >
                <span className={'material-icons-round'} style={{transform: 'rotate(180deg)'}}>create_new_folder</span>
            </Button>
            <Button
                className={styles.settingsButton}
                variant={starred ? "filled" : undefined}
                onClick={() => {
                    if (starred)
                        props.bookmarksHook.removeBookmark(props.hook.currentDirectory.id)
                    else
                        props.bookmarksHook.addBookmark(props.hook.currentDirectory.id)
                }}
            >
                <span className={'material-icons-round'}>star</span>
            </Button>

            <div className={styles.pathWrapper}>
                {props.path.map((p, i) => (
                    <React.Fragment key={p.path}>
                        <button
                            className={styles.button}
                            onClick={() => {
                                const found = props.hook.items.find(i => i.id === p.path)
                                if (found)
                                    props.hook.setCurrentDirectory(found)
                                else
                                    props.hook.setCurrentDirectory({
                                        id: '\\'
                                    })
                            }}>
                            {p.name}
                        </button>
                        {i < props.path.length - 1 ? '/' : null}
                    </React.Fragment>
                ))}
            </div>
            <Search
                searchString={props.searchString}
                height={'30px'}
                setSearchString={props.setSearchString}
                width={'50%'}
            />

            <div className={styles.buttonGroup}>
                <Dropdown
                    styles={{borderRadius: '5px 0 0 5px'}}
                    variant={'outlined'}
                    className={styles.settingsButton}
                >
                    <span className={'material-icons-round'} style={{fontSize: '1.1rem'}}>view_headline</span>View
                    <DropdownOptions>
                        <DropdownOption option={{
                            icon: props.visualizationType === 0 ? <span className={'material-icons-round'}
                                                                        style={{fontSize: '1.1rem'}}>check</span> : null,
                            label: 'Big card',
                            onClick: () => props.setVisualizationType(0)
                        }}/>
                        <DropdownOption option={{
                            icon: props.visualizationType === 1 ? <span className={'material-icons-round'}
                                                                        style={{fontSize: '1.1rem'}}>check</span> : null,
                            label: 'Small card',
                            onClick: () => props.setVisualizationType(1)
                        }}/>
                        <DropdownOption option={{
                            icon: props.visualizationType === 2 ? <span className={'material-icons-round'}
                                                                        style={{fontSize: '1.1rem'}}>check</span> : null,
                            label: 'List',
                            onClick: () => props.setVisualizationType(2)
                        }}/>
                    </DropdownOptions>
                </Dropdown>

                <ImportHandler {...props}/>
            </div>
        </div>
    )
}

ControlBar.propTypes = {
    visualizationType: PropTypes.number,
    setVisualizationType: PropTypes.func,


    searchString: PropTypes.string,
    setSearchString: PropTypes.func,
    path: PropTypes.arrayOf(PropTypes.object),

    bookmarksHook: PropTypes.object,
    hook: PropTypes.object.isRequired,
    hidden: PropTypes.bool
}
