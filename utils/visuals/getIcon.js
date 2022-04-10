import styles from "../../styles/Item.module.css";

export default function getIcon({
                                    type, preview, visualization, childrenQuantity
                                }) {

    switch (type) {
        case 'pimg': {
            if (preview)
                return (
                    <div style={{position: 'relative'}} className={styles.imageWrapper} data-size={`${visualization}`}>
                        <img src={preview} draggable={false} alt={'image'} className={styles.image}/>
                    </div>
                )
            return (
                <div className={styles.icon} data-size={`${visualization}`}>
                    <span className={'material-icons-round'}>image</span>
                </div>
            )
        }

        case 'material':
            if (preview)
                return (
                    <div style={{position: 'relative'}} className={styles.imageWrapper} data-size={`${visualization}`}>
                        <img src={preview} draggable={false} alt={'image'} className={styles.image}/>
                    </div>
                )
            return (
                <div className={styles.icon} data-size={`${visualization}`}>
                    <span className={'material-icons-round'}>texture</span>
                </div>
            )
        case 'terrain':
            return (
                <div className={styles.icon} data-size={`${visualization}`}>
                    <span className={'material-icons-round'}>terrain</span>
                </div>
            )
        case 'mesh':
            if (preview)
                return (
                    <div style={{position: 'relative'}} className={styles.imageWrapper} data-size={`${visualization}`}>
                        <img src={preview} draggable={false} alt={'image'} className={styles.image}/>
                    </div>
                )
            return (
                <div className={styles.icon} data-size={`${visualization}`}>
                    <span className={'material-icons-round'}>view_in_ar</span>
                </div>
            )
        case 'flow':

            return (
                <div className={styles.icon} data-size={`${visualization}`}>
                    <span className={'material-icons-round'}>engineering</span>
                </div>
            )
        case 'folder': {
            console.log(childrenQuantity)
            return (
                <div className={styles.icon} data-size={`${visualization}`}>
                    <span className={'material-icons-round'}>{childrenQuantity > 0 ? 'source' : 'folder_open'}</span>
                </div>
            )
        }
        default:
            return (
                <div className={styles.icon} data-size={`${visualization}`}>
                    <span className={'material-icons-round'}>description</span>
                </div>
            )
    }
}
