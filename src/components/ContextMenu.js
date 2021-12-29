import {useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import styles from '../styles/Context.module.css'
import {Button} from "@f-ui/core";
import React from 'react'

export default function ContextMenu(props) {
    const ref = useRef()
    const contextRef = useRef()
    const [selected, setSelected] = useState()
    const [selectedType, setSelectedType] = useState()
    const handleContext = (event) => {
        let target = document.elementsFromPoint(event.clientX, event.clientY)
        target = target.filter(t => t.getAttribute('data-context') === (props.asDirectory ? 'dir' : 'file'))


        if (target.length === 1) {
            target = target[0]

            event.preventDefault()
            setSelected(target.getAttribute('data-identification'))
            contextRef.current.style.zIndex = '10'
            contextRef.current.style.left = event.clientX + 'px'
            contextRef.current.style.top = event.clientY + 'px'
            setSelectedType(undefined)

        } else if (props.asDirectory) {
            event.preventDefault()
            contextRef.current.style.zIndex = '10'
            contextRef.current.style.left = event.clientX + 'px'
            contextRef.current.style.top = event.clientY + 'px'
            setSelectedType('dir')
        }
    }
    const handleMouseDown = (event) => {
        if (!document.elementsFromPoint(event.clientX, event.clientY).includes(contextRef.current))
            contextRef.current.style.zIndex = '-1'

    }
    useEffect(() => {
        document.addEventListener('mousedown', handleMouseDown)
        ref.current?.addEventListener('contextmenu', handleContext)
        return () => {
            document.removeEventListener('mousedown', handleMouseDown)
            ref.current?.removeEventListener('contextmenu', handleContext)
        }
    }, [])
    return (
        <>
            <div className={styles.wrapper} ref={contextRef}>
                {selected && selectedType !== 'dir' ?
                    <>
                        <Button className={styles.button} onClick={() => {
                            props.handleChange({
                                type: 'rename',
                                target: selected
                            })
                            contextRef.current.style.zIndex = '-1'
                            setSelected(undefined)
                        }}>
                            <span className={'material-icons-round'}>edit</span>
                            Rename
                        </Button>
                        <Button
                            className={styles.button}
                            color={'secondary'}
                            onClick={() => {
                                props.handleChange({
                                    type: 'delete',
                                    target: selected
                                })

                                contextRef.current.style.zIndex = '-1'
                                setSelected(undefined)
                            }}>
                            <span className={'material-icons-round'}>delete</span>
                            Delete
                        </Button>
                    </>
                    :
                    (
                        <Button className={styles.button} onClick={() => {
                            props.handleChange({
                                type: 'create-folder'
                            })
                            contextRef.current.style.zIndex = '-1'
                            setSelected(undefined)
                        }}>
                            <span className={'material-icons-round'}>create_new_folder</span>
                            Create folder
                        </Button>
                    )
                }
            </div>
            <div className={props.className} style={props.styles} ref={ref}>
                {props.children}
            </div>
        </>
    )
}

ContextMenu.propTypes = {
    asDirectory: PropTypes.bool,
    handleChange: PropTypes.func,
    children: PropTypes.node,
    styles: PropTypes.object,
    className: PropTypes.string
}
