import styles from "../../styles/ItemCard.module.css";

export default function getIcon(type, preview, className, imageClass, childrenQuantity, noIcon) {
    switch (type) {
        case 'pimg': {
            if (preview)
                return (
                    <div style={{position: 'relative'}} className={imageClass}>
                        <img src={preview} draggable={false} alt={'image'} className={styles.image}/>
                        <div style={{display: noIcon ? 'none' : undefined}} className={styles.floatingIcon}>
                            <span style={{fontSize: '1rem'}} className={'material-icons-round'}>image</span>
                        </div>
                    </div>
                )
            return (
                <div className={[styles.icon, className].join(' ')}>
                    <span className={'material-icons-round'}>image</span>
                </div>
            )
        }

        case 'material':
            if (preview)
                return (
                    <div style={{position: 'relative'}} className={imageClass}>
                        <img src={preview} draggable={false} alt={'image'} className={styles.image}/>
                        <div style={{display: noIcon ? 'none' : undefined}} className={styles.floatingIcon}>
                            <span style={{fontSize: '1rem'}} className={'material-icons-round'}>texture</span>
                        </div>
                    </div>
                )
            return (
                <div className={[styles.icon, className].join(' ')}>
                    <span className={'material-icons-round'}>texture</span>
                </div>
            )
        case 'terrain':
            return (
                <div className={[styles.icon, className].join(' ')}>
                    <span className={'material-icons-round'}>terrain</span>
                </div>
            )
        case 'mesh':
            if (preview)
                return (
                    <div style={{position: 'relative'}} className={imageClass}>
                        <img src={preview} draggable={false} alt={'image'} className={styles.image}/>
                        <div style={{display: noIcon ? 'none' : undefined}} className={styles.floatingIcon}>
                            <span style={{fontSize: '1rem'}} className={'material-icons-round'}>view_in_ar</span>
                        </div>
                    </div>
                )
            return (
                <div className={[styles.icon, className].join(' ')}>
                    <span className={'material-icons-round'}>view_in_ar</span>
                </div>
            )
        case 'flow':

            return (
                <div className={[styles.icon, className].join(' ')}>
                    <span className={'material-icons-round'}>engineering</span>
                </div>
            )
        case 'folder': {
            return (
                <div className={[styles.icon, className].join(' ')}>
                    <span className={'material-icons-round'}>{childrenQuantity > 0 ? 'source' : 'folder_open'}</span>
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
