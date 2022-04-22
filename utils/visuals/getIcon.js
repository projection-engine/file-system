import styles from "../../styles/Item.module.css";
import Preview from "../../../../components/preview/Preview";

export default function getIcon({
                                    path,
                                    type,
                                    preview,
                                    visualization,
                                    childrenQuantity
                                }) {

    switch (type) {
        case 'pimg':
        case 'material':
            return (
                <div style={{position: 'relative'}} className={[styles.imageWrapper, styles.icon].join(' ')} data-size={`${visualization}`}>
                    <Preview iconStyles={{fontSize: '4rem'}} path={path} className={styles.image} fallbackIcon={type === 'material' ? 'texture' : undefined}/>
                    {/*<img ref={imageRef} src={undefined} draggable={false} alt={'image'} className={styles.image}/>*/}
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
