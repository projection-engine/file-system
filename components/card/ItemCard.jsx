import PropTypes from "prop-types";
import styles from '../../styles/ItemCard.module.css'
import React, {useMemo} from "react";
import parseFileType from "../../utils/visuals/parseFileType";
import getIcon from "../../utils/visuals/getIcon";
import useItem from "../../hooks/useItem";
import ItemTooltip from "../ItemTooltip";

export default function ItemCard(props) {
    const className = useMemo(() => {
        switch (props.variant) {
            case 'big':
                return {
                    wrapper: styles.fileBig,
                    label: styles.fileBigLabel,
                    icon: styles.fileBigIcon
                }
            default:
                return {
                    wrapper: styles.fileSmall,
                    label: styles.fileSmallLabel,
                    icon: styles.fileSmallIcon
                }
        }
    }, [props.visualizationType])

    const icon = useMemo(() => {
        return getIcon(props.data.type ? props.data.type : 'folder', props.data, className.icon, styles.imageWrapper, props.childrenQuantity)
    }, [props.data, className])

    const {
        ref,
        currentlyOnRename,
        currentLabel,
        setCurrentLabel
    } = useItem(props)

    return (
        <div
            ref={ref}
            onDragStart={e => e.dataTransfer.setData('text', props.type === 1 ? props.data.registryID : props.data.id)}
            draggable={!currentlyOnRename}
            data-focused={`${props.focusedElement === props.data.id}`}
            className={[styles.file, className.wrapper].join(' ')}
        >
            {icon}
            <div className={className.label}>
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
                    (props.type === 1 ?
                            <>

                                <div className={[styles.label, styles.overflow].join(' ')}>
                                    {currentLabel}
                                </div>
                                <div className={[styles.type, styles.overflow].join(' ')}
                                     style={{display: props.variant === 'big' ? undefined : 'none'}}>
                                    {parseFileType(props.data.type)}
                                </div>
                            </>
                            :
                            <div className={[styles.label, styles.overflow].join(' ')}
                                 style={{textAlign: 'center', padding: '8px 8px 16px 8px'}}>
                                {currentLabel}
                            </div>
                    )
                }
            </div>
            <ItemTooltip childrenQuantity={props.childrenQuantity} data={props.data} currentLabel={currentLabel} type={props.type}/>
        </div>
    )
}

ItemCard.propTypes = {
    variant: PropTypes.oneOf(['small', 'big']).isRequired,
    childrenQuantity: PropTypes.number,
    setFocusedElement: PropTypes.func,
    focusedElement: PropTypes.string,
    type: PropTypes.oneOf([0, 1]),
    data: PropTypes.object,
    selected: PropTypes.string,
    setSelected: PropTypes.func,
    openEngineFile: PropTypes.func.isRequired,
    hook: PropTypes.object,
    onRename: PropTypes.string,
    submitRename: PropTypes.func
}
