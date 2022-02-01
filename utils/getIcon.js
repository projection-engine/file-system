import styles from "../styles/Item.module.css";

export default function getIcon(type, file, className) {
    switch (type) {
        case 'jpg':
        case 'jpeg':
        case 'material':
        case 'mesh':
        case 'png': {
            return (
                <div className={className}>
                    <img src={file?.preview} alt={'image'} className={styles.image}/>
                </div>
            )
        }
        case 'Folder': {
            return (
                <div className={className}>
                    <span className={'material-icons-round'} style={{fontSize: '3.5rem'}}>folder</span>
                </div>
            )
        }
        default:
            return (
                <div className={className}>
                    <span className={'material-icons-round'} style={{fontSize: '2.5rem'}}>description</span>
                </div>
            )
    }
}
