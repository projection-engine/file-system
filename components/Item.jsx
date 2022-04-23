import PropTypes from "prop-types";
import styles from '../styles/Item.module.css'
import React, {useMemo} from "react";
import getIcon from "../utils/visuals/getIcon";
import useItem from "../hooks/useItem";
import ItemTooltip from "./ItemTooltip";

export default function Item(props) {

    const {
        ref,
        currentlyOnRename,
        currentLabel,
        setCurrentLabel,
        preview,
        selected, handleDrag
    } = useItem(props)

    const icon = useMemo(() => {
        return getIcon({
            path: props.hook.fileSystem.path + '\\previews\\' + props.data.registryID + '.preview',
            type: props.data.type ? props.data.type : 'folder',
            preview,
            visualization: props.visualizationType,
            childrenQuantity: props.childrenQuantity
        })
    }, [props.data, props.visualizationType])

    return (
        <div
            ref={ref}
            id={props.data.id}
            data-size={props.visualizationType}
            onDragStart={handleDrag}
            draggable={!currentlyOnRename}
            onClick={props.setSelected}
            style={{
                background: selected ? 'var(--fabric-accent-color)' : props.visualizationType === 2 ? (props.index % 2 === 0 ? 'var(--fabric-background-secondary)' : 'var(--fabric-background-tertiary)') : undefined
            }}
            className={styles.file}
        >
            {icon}
            {currentlyOnRename ?
                <input
                    className={styles.input}
                    onKeyPress={key => {
                        if (key.code === 'Enter')
                            props.submitRename(currentLabel)
                    }}
                    onBlur={() => {
                        props.submitRename(currentLabel)
                    }}
                    onChange={e => setCurrentLabel(e.target.value)}
                    value={currentLabel}
                />
                :
                <div className={[styles.label, styles.overflow].join(' ')}>
                    {currentLabel}{props.type === 0 ? '' : '.' + props.data.type}
                </div>
            }
            <ItemTooltip
                childrenQuantity={props.childrenQuantity}
                data={props.data}
                currentLabel={currentLabel}
                type={props.type}
            />
        </div>
    )
}

Item.propTypes = {
    index: PropTypes.number,
    visualizationType: PropTypes.number,
    childrenQuantity: PropTypes.number,

    type: PropTypes.oneOf([0, 1]),
    data: PropTypes.object,
    selected: PropTypes.array,
    setSelected: PropTypes.func,
    openEngineFile: PropTypes.func.isRequired,
    hook: PropTypes.object,
    onRename: PropTypes.string,
    submitRename: PropTypes.func
}
