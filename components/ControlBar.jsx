import PropTypes from "prop-types";
import styles from '../styles/Control.module.css'
import {Button} from "@f-ui/core";
import React, {useContext, useRef} from "react";

import Search from "../../../components/search/Search";
import EVENTS from "../../../pages/project/utils/misc/EVENTS";
import LoadProvider from "../../../pages/project/hook/LoadProvider";
import FileBlob from "../../../services/workers/FileBlob";


export default function ControlBar(props) {
    const fileRef = useRef()
    const folderRef = useRef()
    const load = useContext(LoadProvider)

    return (
        <>
            <input
                type={'file'}
                ref={fileRef}
                accept={['.obj', '.png', '.jpeg', '.jpg', '.hdr', '.gltf', '.glt', '.material']}
                multiple={true}
                onChange={e => {
                    load.pushEvent(EVENTS.IMPORT_FILE)
                    //TODO
                    const f = e.target.files[0]
                    props.hook.fileSystem
                        .importFile(f, props.hook.currentDirectory.id)
                        .then(res => {
                            load.finishEvent(EVENTS.IMPORT_FILE)
                        })
                    e.target.value = "";
                }}
                style={{display: 'none'}}
            />
            <input
                type={'file'}
                ref={folderRef}
                accept={['.obj', '.png', '.jpeg', '.jpg', '.hdr', '.gltf', '.glt', '.bin', '.material']}

                directory=""
                webkitdirectory=""
                multiple={true}
                onChange={e => {
                    load.pushEvent(EVENTS.IMPORT_FILE)
                    //TODO
                    e.target.value = "";
                }}
                style={{display: 'none'}}
            />


            <div style={{display: 'flex', alignItems: 'center', gap: '4px', width: '100%'}}>
                <Button className={styles.settingsButton} onClick={() => props.setVisualizationType(0)}
                        highlight={props.visualizationType === 0}>
                    <span className={'material-icons-round'}>grid_view</span>
                </Button>
                <Button className={styles.settingsButton} onClick={() => props.setVisualizationType(1)}
                        highlight={props.visualizationType === 1}>

                    <span className={'material-icons-round'}>view_comfy</span>
                </Button>
                <Button className={styles.settingsButton} onClick={() => props.setVisualizationType(2)}
                        highlight={props.visualizationType === 2}>
                    <span className={'material-icons-round'}>view_list</span>
                </Button>
                <Search searchString={props.searchString} setSearchString={props.setSearchString}/>
                {props.path.map((p, i) => (
                    <React.Fragment key={p.id}>
                        <Button className={styles.button}
                                styles={{fontWeight: props.hook.currentDirectory.id === p ? 600 : undefined}}
                                highlight={props.hook.currentDirectory.id === p.id}
                                onClick={() => {
                                    const found = props.hook.items.find(i => i.id === p.id)
                                    if (found)
                                        props.hook.setCurrentDirectory(found)
                                }}>
                            {p.name}
                        </Button>
                        {i < props.path.length - 1 ?
                            <span className={'material-icons-round'}>chevron_right</span> : null}
                    </React.Fragment>
                ))}
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                <Button onClick={() => fileRef.current.click()} className={styles.button}
                        variant={'minimal-horizontal'}>
                    <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>description</span>
                    Import file
                </Button>
                <Button onClick={() => folderRef.current.click()} className={styles.button}
                        variant={'minimal-horizontal'}>
                    <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>folder</span>
                    Import folder
                </Button>
            </div>
        </>
    )
}

ControlBar.propTypes = {
    visualizationType: PropTypes.number,
    setVisualizationType: PropTypes.func,


    searchString: PropTypes.string,
    setSearchString: PropTypes.func,
    path: PropTypes.arrayOf(PropTypes.object),

    hook: PropTypes.object.isRequired,
    accept: PropTypes.array,
    label: PropTypes.string,
    setHidden: PropTypes.func,
    hidden: PropTypes.bool
}
