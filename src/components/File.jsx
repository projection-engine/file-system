import PropTypes from "prop-types";
import styles from '../styles/Files.module.css'
import React from "react";
import {ToolTip} from "@f-ui/core";

export default function File(props){
    const getIcon = (type) => {
        switch (type) {
            case 'obj': {
                return (
                    <div className={styles.icon} style={{border: 'none'}}>
                        <span className={'material-icons-round'} style={{fontSize: '2.5rem'}}>category</span>
                    </div>
                )
            }
            case 'png': {
                return (
                    <div className={styles.icon} style={{border: 'none'}}>
                        <span className={'material-icons-round'} style={{fontSize: '2.5rem'}}>image</span>
                    </div>
                )
            }
            default:
                return (
                    <div className={styles.icon} style={{border: 'none'}}>
                        <span className={'material-icons-round'} style={{fontSize: '2.5rem'}}>description</span>
                    </div>
                )
        }
    }

   return (
       <div
           onDragStart={e => e.dataTransfer.setData('text',  props.data.id)}
           draggable={true}
            className={styles.file}
            data-context={'file'}
            data-identification={props.data.id}>
           {getIcon(props.data.type)}
           <div className={styles.labelWrapper}>
               {props.data.name}
           </div>
           <ToolTip align={"middle"} justify={'end'}>
               <div className={styles.infoRow}>
                   Name:
                   <div className={styles.infoRowContent}>
                       {props.data.name}
                   </div>
               </div>
               <div className={styles.infoRow}>
                   Creation date:
                   <div className={styles.infoRowContent}>
                       {props.data.creationDate?.toLocaleDateString()}
                   </div>
               </div>
               <div className={styles.infoRow}>
                   Type:
                   <div className={styles.infoRowContent}>
                       {props.data.type}
                   </div>
               </div>
               <div className={styles.infoRow}>
                   Size:
                   <div className={styles.infoRowContent}>
                       {props.data.size ? (props.data.size < 100000 ? (props.data.size /1000).toFixed(2) + 'KB' : (props.data.size / (10 ** 6)).toFixed(2) + ' MB') : 'NaN'}
                   </div>
               </div>
               <div className={styles.infoRow}>
                   ID:
                   <div className={styles.infoRowContent}>
                       {props.data.id}
                   </div>
               </div>
           </ToolTip>
       </div>
   )
}

File.propTypes={
    data: PropTypes.object
}
