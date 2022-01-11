import styles from "../styles/Files.module.css";

export default function getIcon (type, file) {
    switch (type) {
        case 'obj': {
            return (
                <div className={styles.icon} style={{border: 'none'}}>
                    <span className={'material-icons-round'} style={{fontSize: '2.5rem'}}>category</span>
                </div>
            )
        }
        case 'jpg':
        case 'jpeg':
        case 'png': {
            return (
                <div className={styles.icon} style={{border: 'none'}}>
                    <img src={file?.blob} alt={'image'} className={styles.image}/>
                </div>
            )
        }
        case 'material': {
            return (
                <div
                    className={styles.icon}
                    style={{border: 'none'}}
                >
                    <span className={'material-icons-round'} style={{fontSize: '2.5rem'}}>language</span>
                </div>
            )
        }
        case 'Folder': {
            return (
                <div className={styles.icon} style={{border: 'none'}}>
                    <span className={'material-icons-round'} style={{fontSize: '3.5rem'}}>folder</span>
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
