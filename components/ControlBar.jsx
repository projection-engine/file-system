import PropTypes from "prop-types"
import styles from "../styles/Control.module.css"
import {Button, Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core"
import React, {useMemo} from "react"
import Search from "../../../../components/search/Search"
import ImportHandler from "./ImportHandler"
import AsyncFS from "../../../templates/AsyncFS"
import FileSystem from "../../../utils/files/FileSystem"
import FILE_TYPES from "../../../../../public/project/glTF/FILE_TYPES"

export default function ControlBar(props) {
    const  {
        visualizationType,
        setVisualizationType,
        searchString,
        setSearchString,
        path,
        bookmarksHook,
        hook,
        hidden,
        setAlert
    } = props
    const disabled = useMemo(() => {
        return {
            backwards: hook.navIndex === 0 ,
            forward: hook.navIndex === 9 || hook.navHistory[hook.navIndex + 1] === undefined
        }
    }, [hook.navHistory, hook.navIndex])
    const starred = useMemo(() => {
        return bookmarksHook.bookmarks.find(b => b.path === hook.currentDirectory.id) !== undefined
    }, [hook.currentDirectory, bookmarksHook.bookmarks])

    return (
        <div className={styles.wrapper} style={{border: hidden ? "none" : undefined}}>
            <div className={styles.buttonGroup}>
                <Button
                    disabled={disabled.backwards}
                    className={styles.settingsButton}
                    styles={{borderRadius: "5px 0 0 5px"}}
                    onClick={() => hook.returnDir()}
                >
                    <span className={"material-icons-round"}>arrow_back</span>
                </Button>
                <Button
                    disabled={disabled.forward}
                    styles={{borderRadius: 0}}
                    className={styles.settingsButton}
                    onClick={() => hook.forwardDir()}
                >
                    <span className={"material-icons-round"} style={{transform: "rotate(180deg)"}}>arrow_back</span>
                </Button>
                <Button
                    className={styles.settingsButton}
                    styles={{borderRadius: 0}}
                    disabled={hook.currentDirectory.id === FileSystem.sep}
                    onClick={() => {
                        const found = hook.currentDirectory.id
                        if (found) {
                            const split = found.split(FileSystem.sep )
                            split.pop()
                            if (split.length === 1)
                                hook.setCurrentDirectory({id: FileSystem.sep })
                            else
                                hook.setCurrentDirectory({id: split.join(FileSystem.sep)})
                        }
                    }}
                >
                    <span className={"material-icons-round"}
                        style={{transform: "rotate(180deg)"}}>subdirectory_arrow_right</span>
                </Button>
                <Button
                    disabled={hook.loading}
                    className={styles.settingsButton}
                    styles={{borderRadius: "0 5px 5px 0", border: "none"}}
                    onClick={() => {
                        setAlert({message: "Refreshing files", type: "info"})
                        hook.refreshFiles().catch()
                    }}
                >
                    <span className={"material-icons-round"}>sync</span>
                </Button>
            </div>
            <Button
                styles={{border: "none"}}
                className={styles.settingsButton}
                onClick={async () => {
                    let path = hook.currentDirectory.id + FileSystem.sep + "New folder"

                    const existing = hook.fileSystem.foldersFromDirectory(hook.path + hook.currentDirectory.id)
                    if (existing.length > 0)
                        path += " - " + existing.length
                    await AsyncFS.mkdir(hook.path + path, {})
                    hook.refreshFiles()
                }}

            >
                <span className={"material-icons-round"} style={{transform: "rotate(180deg)"}}>create_new_folder</span>
            </Button>
            <Button
                className={styles.settingsButton}
                variant={starred ? "filled" : undefined}
                styles={{border: "none"}}
                onClick={() => {
                    if (starred)
                        bookmarksHook.removeBookmark(hook.currentDirectory.id)
                    else
                        bookmarksHook.addBookmark(hook.currentDirectory.id)
                }}
            >
                <span className={"material-icons-round"}>star</span>
            </Button>
            <Dropdown
                disabled={hook.loading} hideArrow={true}
                className={styles.settingsButton}
                styles={{border: "none"}}
                onClick={() => {
                    hook.refreshFiles().catch()
                }}
                variant={props.fileType !== undefined ? "filled": undefined}
            >
                <span className={"material-icons-round"}>filter_alt</span>
                <DropdownOptions>
                    {Object.keys(FILE_TYPES).map((k, i) => (
                        <React.Fragment key={k + "-filter-key-" + i}>
                            <DropdownOption
                                option={{
                                    label: k.toLowerCase().replace("_", " "),
                                    icon: props.fileType === FILE_TYPES[k] ? <span className={"material-icons-round"}>check</span> : undefined,
                                    onClick: () => props.setFileType(props.fileType === FILE_TYPES[k] ? undefined : FILE_TYPES[k]),
                                    keepAlive: false    ,
                                }}
                                className={styles.fileType}
                            />
                        </React.Fragment>
                    ))}
                </DropdownOptions>
            </Dropdown>
            <div className={styles.pathWrapper}>
                {path.map((p, i) => (
                    <React.Fragment key={p.path}>
                        <button
                            className={styles.button}
                            onClick={() => {
                                const found = hook.items.find(i => i.id === p.path)
                                if (found)
                                    hook.setCurrentDirectory(found)
                                else
                                    hook.setCurrentDirectory({
                                        id: FileSystem.sep
                                    })
                            }}>
                            {p.name}
                        </button>
                        {i < path.length - 1 ? "/" : null}
                    </React.Fragment>
                ))}
            </div>
            <Search
                searchString={searchString}
                height={"30px"}
                setSearchString={setSearchString}
                width={"50%"}
            />

            <div className={styles.buttonGroup}>
                <Dropdown
                    styles={{borderRadius: "5px 0 0 5px"}}
                    variant={"outlined"}
                    className={styles.settingsButton}
                >
                    <span className={"material-icons-round"} style={{fontSize: "1.1rem"}}>view_headline</span>View
                    <DropdownOptions>
                        <DropdownOption option={{
                            icon: visualizationType === 0 ? <span className={"material-icons-round"}
                                style={{fontSize: "1.1rem"}}>check</span> : null,
                            label: "Big card",
                            onClick: () => setVisualizationType(0)
                        }}/>
                        <DropdownOption option={{
                            icon: visualizationType === 1 ? <span className={"material-icons-round"}
                                style={{fontSize: "1.1rem"}}>check</span> : null,
                            label: "Small card",
                            onClick: () => setVisualizationType(1)
                        }}/>
                        <DropdownOption option={{
                            icon: visualizationType === 2 ? <span className={"material-icons-round"}
                                style={{fontSize: "1.1rem"}}>check</span> : null,
                            label: "List",
                            onClick: () => setVisualizationType(2)
                        }}/>
                    </DropdownOptions>
                </Dropdown>

                <ImportHandler {...props}/>
            </div>
        </div>
    )
}

ControlBar.propTypes = {
    fileType: PropTypes.string,
    setFileType: PropTypes.func,

    visualizationType: PropTypes.number,
    setVisualizationType: PropTypes.func,


    searchString: PropTypes.string,
    setSearchString: PropTypes.func,
    path: PropTypes.arrayOf(PropTypes.object),

    bookmarksHook: PropTypes.object,
    hook: PropTypes.object.isRequired,
    hidden: PropTypes.bool,
    setAlert: PropTypes.func
}
