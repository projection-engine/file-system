import styles from "../../styles/Item.module.css";
import Preview from "../../../../../components/preview/Preview";

export default function getIcon({
                                    path,
                                    type,
                                    visualization,
                                    childrenQuantity
                                }) {

    const common = (t) =>  (
        <div className={styles.icon} data-size={`${visualization}`}>
            <Preview
                iconStyles={{fontSize: '4rem'}}

                path={path} className={styles.image}
                fallbackIcon={t}
            />
            <div title={type === 'pimg' ? 'image' : type} className={styles.floatingIconWrapper} style={{display: visualization === 2 ? 'none' : undefined}}>
                <span className={['material-icons-round', styles.floatingIcon].join(' ')}>{t}</span>
            </div>
        </div>
    )
    switch (type) {
        case 'pimg':
            return  common('image')
        case 'material':
            return  common('texture')
        case 'terrain':
            return  common('terrain')
        case 'mesh':
            return  common('view_in_ar')
        case 'flow':
            return (
                <div className={styles.icon} data-size={`${visualization}`}>
                    <span className={'material-icons-round'}>code</span>
                </div>
            )
        case 'flowRaw':
            return (
                <div className={styles.icon} data-size={`${visualization}`}>
                    <span className={'material-icons-round'}>javascript</span>
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
