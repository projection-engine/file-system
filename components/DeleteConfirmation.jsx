import PropTypes from "prop-types";
import {deleteData} from "../utils/handleDelete";
import {useContext, useEffect, useState} from "react";
import {Button, Modal, ToolTip} from "@f-ui/core";
import styles from '../styles/DeleteConfirmation.module.css'
import QuickAccessProvider from "../../../services/hooks/QuickAccessProvider";
import {KEYS} from "../../../services/hooks/useHotKeys";

export default function DeleteConfirmation(props) {
    const [open, setOpen] = useState(false)

    const submit = () => {
        setOpen(false)
        deleteData(props.hook.toDelete.file, props.hook)
            .then(toRemove => {
                props.hook.removeEntities(props.hook.toDelete.relatedEntities.map(e => {
                    return e.entity
                }))

                props.hook.setItems(prev => {
                    return prev.filter(p => !toRemove.includes(p.id))
                })
                quickAccess.refresh()
                props.hook.setToDelete({})
            })
    }


    useEffect(() => {
        const notEmpty = Object.keys(props.hook.toDelete).length > 0

        if (notEmpty && props.hook.toDelete.relatedEntities.length === 0 && props.hook.toDelete.relatedFiles.length === 1)
            submit()
        else
            setOpen(notEmpty)
    }, [props.hook.toDelete])
    const quickAccess = useContext(QuickAccessProvider)


    const handleKey = (e) => {
        if (e.code === KEYS.Enter)
            submit()
    }
    useEffect(() => {
        if (open)
            document.addEventListener('keydown', handleKey, {once: true})
        return () => document.removeEventListener('keydown', handleKey)
    }, [open])


    return (
        <Modal open={open} handleClose={() => null} className={styles.modal}>
            {open ?
                <>
                    <div className={styles.warning}>
                        Delete assets
                    </div>
                    <div className={styles.message}>
                        {props.hook.toDelete.relatedEntities?.length > 0 ?
                            'The following entities depend on the files to be deleted, do you want to continue ?' : 'Do you want to permanently delete these files ?'
                        }
                    </div>
                    <div className={styles.toBeDeleted}
                         style={{display: props.hook.toDelete.relatedEntities.length === 0 && props.hook.toDelete.relatedFiles?.length === 0 ? 'none' : undefined}}>
                        <div className={styles.row}
                             style={{borderBottom: 'var(--fabric-border-primary) 1px solid', marginBottom: '4px'}}>
                            <div style={{display: props.hook.toDelete.relatedEntities > 0 ? undefined : 'none'}}
                                 className={styles.overflow}>
                                Entity
                            </div>

                            <div className={styles.overflow}>
                                File
                            </div>
                        </div>
                        {props.hook.toDelete.relatedEntities.map((e, i) => (
                            <div key={e.name + '-' + i} className={styles.row}>
                                <div className={[styles.overflow, styles.row].join(' ')} style={{gap: '4px'}}>
                                    {e.name}
                                    <ToolTip>
                                        {e.name}
                                    </ToolTip>
                                    <span className={'material-icons-round'}>navigate_next</span>
                                </div>

                                <div className={styles.overflow}>
                                    {e.file?.name}
                                    <ToolTip>
                                        {e.file?.name}
                                    </ToolTip>
                                </div>
                            </div>
                        ))}
                        {props.hook.toDelete.relatedEntities.length === 0 ? props.hook.toDelete.relatedFiles.map((e, i) => (
                            <div key={e + '-file-' + i} className={styles.row}>
                                <div className={[styles.overflow, styles.row].join(' ')} style={{gap: '4px'}}>
                                    {e}
                                    <ToolTip>
                                        {e}
                                    </ToolTip>
                                </div>
                            </div>
                        )) : null}
                    </div>

                    <div className={styles.options}>
                        <Button styles={{'--fabric-accent-color': '#ff5555'}} onClick={() => submit()}
                                variant={'filled'}>
                            Delete permanently
                        </Button>
                        <Button variant={'outlined'} onClick={() => {
                            setOpen(false)
                            props.hook.setToDelete({})
                        }}>
                            Cancel
                        </Button>
                    </div>
                </>
                : null
            }
        </Modal>
    )
}
DeleteConfirmation.propTypes = {
    hook: PropTypes.object
}