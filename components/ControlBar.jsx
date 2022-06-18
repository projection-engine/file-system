import PropTypes from "prop-types"
import styles from "../styles/Control.module.css"
import {Button, Dropdown, DropdownOption, DropdownOptions, Icon} from "@f-ui/core"
import React, {useMemo} from "react"
import Search from "../../../../components/search/Search"
import ImportHandler from "./ImportHandler"
import AsyncFS from "../../../templates/AsyncFS"
import FileSystem from "../../../utils/files/FileSystem"
import FILE_TYPES from "../../../../../public/static/FILE_TYPES"

export default function ControlBar(props) {
    const  {
        visualizationType,
        setVisualizationType,
        searchString,
        setSearchString,
        path,
        hook,
        hidden
    } = props
    const disabled = useMemo(() => {
        return {
            backwards: hook.navIndex === 0 ,
            forward: hook.navIndex === 9 || hook.navHistory[hook.navIndex + 1] === undefined
        }
    }, [hook.navHistory, hook.navIndex])
    const starred = useMemo(() => hook.bookmarks.find(b => b.path === hook.currentDirectory.id) !== undefined, [hook.currentDirectory, hook.bookmarks])

    return (
        <div className={styles.wrapper} style={{border: hidden ? "none" : undefined}}>
            <div className={styles.buttonGroup}>
                <Button
                    disabled={disabled.backwards}
                    className={styles.settingsButton}
                    styles={{borderRadius: "5px 0 0 5px"}}
                    onClick={() => hook.returnDir()}
                >
                    <Icon >arrow_back</Icon>
                </Button>
                <Button
                    disabled={disabled.forward}
                    styles={{borderRadius: 0}}
                    className={styles.settingsButton}
                    onClick={() => hook.forwardDir()}
                >
                    <Icon  styles={{transform: "rotate(180deg)"}}>arrow_back</Icon>
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
                    <Icon
                        styles={{transform: "rotate(180deg)"}}>subdirectory_arrow_right</Icon>
                </Button>
                <Button
                    disabled={hook.loading}
                    className={styles.settingsButton}
                    styles={{borderRadius: "0 5px 5px 0", border: "none"}}
                    onClick={() => {
                        alert.pushAlert("Refreshing files",  "info")
                        hook.refreshFiles().catch()
                    }}
                >
                    <Icon >sync</Icon>
                </Button>
            </div>
            <Button
                styles={{border: "none"}}
                className={styles.settingsButton}
                onClick={async () => {
                    let path = hook.currentDirectory.id + FileSystem.sep + "New folder"

                    const existing = document.fileSystem.foldersFromDirectory(hook.path + hook.currentDirectory.id)
                    if (existing.length > 0)
                        path += " - " + existing.length
                    await AsyncFS.mkdir(hook.path + path, {})
                    hook.refreshFiles().catch()
                }}

            >
                <Icon  styles={{transform: "rotate(180deg)"}}>create_new_folder</Icon>
            </Button>
            <Button
                className={styles.settingsButton}
                variant={starred ? "filled" : undefined}
                styles={{border: "none"}}
                onClick={() => {
                    if (starred)
                        hook.removeBookmark(hook.currentDirectory.id)
                    else
                        hook.addBookmark(hook.currentDirectory.id)
                }}
            >
                <Icon >star</Icon>
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
                <Icon >filter_alt</Icon>
                <DropdownOptions>
                    {Object.keys(FILE_TYPES).map((k, i) => (
                        <React.Fragment key={k + "-filter-key-" + i}>
                            <DropdownOption
                                option={{
                                    label: k.toLowerCase().replace("_", " "),
                                    icon: props.fileType === FILE_TYPES[k] ? <Icon >check</Icon> : undefined,
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
                    <Icon  styles={{fontSize: "1.1rem"}}>view_headline</Icon>View
                    <DropdownOptions>
                        <DropdownOption option={{
                            icon: visualizationType === 0 ? <Icon
                                styles={{fontSize: "1.1rem"}}>check</Icon> : null,
                            label: "Big card",
                            onClick: () => setVisualizationType(0)
                        }}/>
                        <DropdownOption option={{
                            icon: visualizationType === 1 ? <Icon
                                styles={{fontSize: "1.1rem"}}>check</Icon> : null,
                            label: "Small card",
                            onClick: () => setVisualizationType(1)
                        }}/>
                        <DropdownOption option={{
                            icon: visualizationType === 2 ? <Icon
                                styles={{fontSize: "1.1rem"}}>check</Icon> : null,
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
    hook: PropTypes.object.isRequired,
    hidden: PropTypes.bool
}
