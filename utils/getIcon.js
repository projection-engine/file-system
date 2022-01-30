import styles from "../styles/Files.module.css";

export default function getIcon(type, file) {
    switch (type) {
        case 'jpg':
        case 'jpeg':
        case 'material':
        case 'mesh':
        case 'png': {
            return (
                <div className={styles.icon}>
                    <img src={file?.preview} alt={'image'} className={styles.image}/>
                </div>
            )
        }
        case 'Folder': {
            return (
                <div className={styles.icon}>
                    <span className={'material-icons-round'} style={{fontSize: '3.5rem'}}>folder</span>
                </div>
            )
        }
        default:
            return (
                <div className={styles.icon}>
                    <span className={'material-icons-round'} style={{fontSize: '2.5rem'}}>description</span>
                </div>
            )
    }
}
