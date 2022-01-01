import PropTypes from "prop-types";
import {Button, Modal, TextField} from "@f-ui/core";
import styles from "../styles/Explorer.module.css";
import React, {useState} from "react";

export default function RenameModal(props){
    const [data, setData] = useState('')

    return(
        <Modal
            className={styles.renameModal}
               open={props.open}
               handleClose={() => props.setOpen(false)}>
            <TextField
                handleChange={e => {
                    setData(e.target.value)
                }}
                width={'100%'}
                size={"small"}
                value={data}
                placeholder={'Rename'}
                noMargin={true}
            />
            <Button
                styles={{width: '100%'}}
                disabled={data.length === 0}
                variant={'filled'}
                onClick={() => {
                    props.submit(data)
                    setData('')
                }}>
                Save
            </Button>
        </Modal>
    )
}

RenameModal.propTypes={
    open: PropTypes.bool,
    setOpen: PropTypes.func,
    submit: PropTypes.func,
    originalValue: PropTypes.string
}
