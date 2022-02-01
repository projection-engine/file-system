import styles from "../../styles/ItemCard.module.css";

export default function getIcon(type, file, className, imageClass) {
    switch (type) {
        case 'jpg':
        case 'jpeg':
        case 'hdr':
        case 'png': {
            if (file.preview)
                return (
                    <div className={imageClass}>
                    <img src={file?.preview}  draggable={false} alt={'image'} className={styles.image}/>
                    </div>
                )
            return (
                <span className={'material-icons-round'}>image</span>
            )
        }

        case 'material':
        case 'mesh':
            if (file.preview)
                return (
                    <div className={imageClass}>
                        <img src={file?.preview} alt={'image'} className={styles.image}/>
                    </div>
                )
            return (
                <div className={[styles.icon, className].join(' ')}>
                    <span className={'material-icons-round'}>view_in_ar</span>
                </div>
            )
        case 'Folder': {
            return (
                <div className={[styles.icon, className].join(' ')}>
                    <span className={'material-icons-round'}>folder</span>
                </div>
            )
        }
        default:
            return (
                <div className={[styles.icon, className].join(' ')}>
                    <span className={'material-icons-round'}>description</span>
                </div>
            )
    }
}
