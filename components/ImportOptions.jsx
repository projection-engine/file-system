import PropTypes from "prop-types";
import styles from '../styles/Control.module.css'
import {Button} from "@f-ui/core";
import React, {useRef} from "react";
import handleImportFile, {handleImportFolder} from "../utils/handleImportFile";
import Search from "../../shared/Search";

export default function ImportOptions(props) {
    const fileRef = useRef()
    const folderRef = useRef()

    return (
        <>

            <input
                type={'file'}
                ref={fileRef} accept={props.accept}
                multiple={true}
                onChange={e => {
                    handleImportFile(Array.from(e.target.files), props.hook)
                    e.target.value = "";
                }}
                style={{display: 'none'}}
            />
            <input
                type={'file'}
                ref={folderRef}
                directory=""
                webkitdirectory=""
                multiple={true}
                onChange={e => {
                    handleImportFolder(Array.from(e.target.files), props.hook)
                    e.target.value = "";
                }}
                style={{display: 'none'}}
            />


            <div style={{display: 'flex', alignItems: 'center', gap: '4px', width: '100%'}}>
                <Search searchString={props.searchString} setSearchString={props.setSearchString}/>
                {props.path.map((p, i) => (
                    <React.Fragment key={p.id}>
                        <Button className={styles.button}
                                styles={{fontWeight: props.hook.currentDirectory === p.id ? 600 : undefined}}
                                highlight={props.hook.currentDirectory === p.id}
                                onClick={() => props.hook.setCurrentDirectory(p.id)}>
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

ImportOptions.propTypes = {
    searchString: PropTypes.string,
    setSearchString: PropTypes.func,
    path: PropTypes.arrayOf(PropTypes.object),

    hook: PropTypes.object.isRequired,
    accept: PropTypes.array,
    label: PropTypes.string,
    setHidden: PropTypes.func,
    hidden: PropTypes.bool
}
