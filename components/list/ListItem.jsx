import PropTypes from "prop-types";
import styles from '../../styles/ListItem.module.css'
import React, {useMemo} from "react";
import getIcon from "../../utils/visuals/getIcon";

import useItem from "../../hooks/useItem";
import ItemTooltip from "../ItemTooltip";

export default function ListItem(props) {

    const icon = useMemo(() => {
        return getIcon(props.data.type ? props.data.type : 'folder', props.data, styles.icon, styles.imageWrapper, props.childrenQuantity)
    }, [props.data])
    const size = useMemo(() => {
        return props.data.size ? (props.data.size < 100000 ? (props.data.size / 1000).toFixed(2) + 'KB' : (props.data.size / (10 ** 6)).toFixed(2) + ' MB') : 'NaN'
    }, [props.data])

    const {
        ref,
        currentlyOnRename,
        currentLabel,
        setCurrentLabel,
        selected, handleDrag
    } = useItem(props)

    return (
        <div
            ref={ref}
            id={props.data.id}
            onDragStart={handleDrag}
            draggable={!currentlyOnRename}
            style={{outlineColor: selected ? 'var(--fabric-accent-color)' : undefined}}
            className={styles.wrapper}
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
                <div className={styles.labels}>
                    <div className={styles.label} style={{fontWeight: 550}}>
                        {props.data.name}
                    </div>
                    <div className={styles.label}>
                        {props.type === 0 ? 'Folder' :'File'}
                    </div>
                    <div className={styles.label}>
                        {size}
                    </div>
                    <div className={styles.label}>
                        {new Date(props.data.creationDate).toLocaleDateString()}
                    </div>
                </div>
            }
            <ItemTooltip childrenQuantity={props.childrenQuantity} data={props.data} currentLabel={currentLabel} type={props.type}/>
        </div>
    )
}

ListItem.propTypes = {

    setFocusedElement: PropTypes.func,
    focusedElement: PropTypes.string,
    type: PropTypes.oneOf([0, 1]),
    data: PropTypes.object,
    selected: PropTypes.array,
    setSelected: PropTypes.func,
    openEngineFile: PropTypes.func.isRequired,
    hook: PropTypes.object,
    onRename: PropTypes.string,
    submitRename: PropTypes.func,
    childrenQuantity: PropTypes.number,
}
