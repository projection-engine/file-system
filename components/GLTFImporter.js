import PropTypes from "prop-types";
import {useMemo} from "react";
import styles from "../styles/Control.module.css";
import {Checkbox} from "@f-ui/core";

export default function GLTFImporter(props) {
    const gltf = useMemo(() => {
        return props.files.filter(f => {
            const t = f.name.split('.').pop()

            return t === 'gltf'
        })
    }, [props.files])

    return (
        <div className={styles.toImport}>

            <div className={styles.input}>
                <Checkbox
                    checked={props.settings.keepNormals}
                    label={'Keep mesh normals'}
                    handleCheck={() => {
                        props.setSettings(prev => {
                            return {...prev, keepNormals: !prev.keepNormals}
                        })
                    }}/>
            </div>
            <div className={styles.input}>
                <Checkbox
                    checked={props.settings.keepTangents}
                    label={'Keep mesh tangents'}
                    handleCheck={() => {
                        props.setSettings(prev => {
                            return {...prev, keepTangents: !prev.keepTangents}
                        })
                    }}/>
            </div>
        </div>

    )
}

GLTFImporter.propTypes = {
    settings: PropTypes.object,
    setSettings: PropTypes.func
}