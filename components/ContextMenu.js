import React, {useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import styles from '../styles/Context.module.css'
import {Button} from "@f-ui/core";

export default function ContextMenu(props) {
    const ref = useRef()
    const contextRef = useRef()
    const [selected, setSelected] = useState()
    const [selectedType, setSelectedType] = useState()
    let target
    const handleContext = (event) => {
        target = document.elementsFromPoint(event.clientX, event.clientY)
        target = target.filter(t => t.getAttribute('data-context') === (props.asDirectory ? 'dir' : 'file'))
        event.preventDefault()

        if (target.length === 1) {
            target = target[0]
            setSelectedType(undefined)
            setSelected(target.getAttribute('data-identification'))
            target.style.outline = '#0095ff 2px solid'
        } else {
            setSelected(undefined)
            setSelectedType(props.asDirectory ? 'dir' : 'file')
        }

        contextRef.current.style.zIndex = '10'
        contextRef.current.style.left = event.clientX + 'px'
        contextRef.current.style.top = event.clientY + 'px'
    }
    const handleMouseDown = (event) => {
        if (!document.elementsFromPoint(event.clientX, event.clientY).includes(contextRef.current)) {

            if(target && target.style && target.style.outline)
                target.style.outline = 'transparent 2px solid'

            setSelectedType(undefined)
            setSelected(undefined)
            contextRef.current.style.zIndex = '-1'
        }

    }
    useEffect(() => {
        document.addEventListener('mousedown', handleMouseDown)
        ref.current?.addEventListener('contextmenu', handleContext)
        return () => {
            document.removeEventListener('mousedown', handleMouseDown)
            ref.current?.removeEventListener('contextmenu', handleContext)
        }
    }, [])

    const getOptions = () => {
        if (!selected && selectedType === 'dir')
            return (

                <Button className={styles.basicButton} onClick={() => {
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
        else if (!selected && selectedType === 'file')
            return (
                <Button
                    styles={{height: '45px', fontWeight: '600', fontSize: '.85rem'}}
                    className={styles.basicButton}

                    onClick={() => {
                        props.handleChange({
                            type: 'create-material'
                        })
                        contextRef.current.style.zIndex = '-1'
                        setSelected(undefined)
                    }}>
                    <div className={styles.highlightIconWrapper}>
                        <span className={'material-icons-round'}>format_paint</span>
                    </div>
                    Create material
                </Button>
            )
        else if (selected)
            return (
                <>
                    <Button className={styles.basicButton} onClick={() => {
                        props.handleChange({
                            type: 'rename',
                            target: selected
                        })
                        contextRef.current.style.zIndex = '-1'
                        setSelected(undefined)
                    }}>
                        <div className={styles.basicIconWrapper}>
                            <span className={'material-icons-round'}>edit</span>
                        </div>
                        Rename
                    </Button>
                    <Button
                        className={styles.basicButton}
                        color={'secondary'}
                        onClick={() => {
                            props.handleChange({
                                type: 'delete',
                                target: selected
                            })

                            contextRef.current.style.zIndex = '-1'
                            setSelected(undefined)
                        }}>
                        <div className={styles.basicIconWrapper}>
                            <span className={'material-icons-round'}>delete</span>
                        </div>
                        Delete
                    </Button>
                </>
            )
    }
    return (
        <>
            <div className={styles.wrapper} ref={contextRef}>
                {getOptions()}
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
