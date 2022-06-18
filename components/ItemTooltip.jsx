import {ToolTip} from "@f-ui/core"
import styles from "../styles/File.module.css"
import React, {useMemo} from "react"
import PropTypes from "prop-types"

export default function ItemTooltip(props){
    const size = useMemo(() => {
        return props.data.size ? (props.data.size < 100000 ? (props.data.size / 1000).toFixed(2) + "KB" : (props.data.size / (10 ** 6)).toFixed(2) + " MB") : "NaN"
    }, [props.data])
    return (
        <ToolTip className={styles.toolTip}>
            <div className={styles.infoRow}>
                    Name:
                <div className={styles.infoRowContent}>
                    {props.currentLabel}
                </div>
            </div>
            <div className={styles.infoRow}>
                    Creation date:
                <div className={styles.infoRowContent}>
                    {props.data.creationDate}
                </div>
            </div>
            {props.type === 1 ?
                <>
                    <div className={styles.infoRow}>
                        Type:
                        <div className={styles.infoRowContent}>
                            {props.data.type}
                        </div>
                    </div>
                    <div className={styles.infoRow}>
                            Size:
                        <div className={styles.infoRowContent}>
                            {size}
                        </div>
                    </div>
                    <div className={styles.infoRow}>
                            Registry ID:
                        <div className={[styles.infoRowContent, styles.overflow].join(" ")} style={{maxWidth: "100px"}}>
                            {props.data.registryID}
                        </div>
                    </div>
                </>
                :
                <div className={styles.infoRow}>
                        Items:
                    <div className={styles.infoRowContent}>
                        {props.childrenQuantity}
                    </div>
                </div>
            }
        </ToolTip>
    )
}
ItemTooltip.propTypes={
    childrenQuantity: PropTypes.number,
    type: PropTypes.oneOf([0, 1]),
    data: PropTypes.object,
    currentLabel: PropTypes.string
}