import PropTypes from "prop-types";
import styles from "../styles/Control.module.css";
import {useEffect, useRef, useState} from "react";

import Range from "../../../../components/range/Range";


export default function TerrainImporter(props) {
    const [img, setImg] = useState()
    const imgRef = useRef()
    useEffect(() => {
        if (img)
            props.setTerrainSettings(prev => {
                return {...prev, dimension: imgRef.current.naturalWidth}
            })
        else
            new Promise(re => {
                let reader = new FileReader();
                reader.addEventListener('load', event => {
                    re(event.target.result)
                });
                reader.readAsDataURL(props.file)
            }).then(res => {
                setImg(res)
            })
    }, [props.file, img])


    return (
        <div className={styles.toImport}>
            <img src={img} ref={imgRef} alt={'Image'} className={styles.image}/>
            <div className={styles.buttonGroup}
                 style={{background: 'var(--fabric-background-primary)', padding: '4px'}}>
                <div className={styles.input}>
                    <label>Height basis</label>
                    <Range
                        value={props.terrainSettings.heightScale / 200}
                        metric={'m'}
                        accentColor={'red'}
                        maxValue={1000}
                        minValue={1}
                        handleChange={v => {
                            props.setTerrainSettings(prev => {
                                return {...prev, heightScale: v}
                            })
                        }}/>
                </div>
                <div className={styles.input}>
                    <label>Scale</label>
                    <Range
                        value={props.terrainSettings.dimension}
                        metric={'m'}
                        accentColor={'green'}
                        maxValue={1000}
                        minValue={1}
                        handleChange={v => {
                            props.setTerrainSettings(prev => {
                                return {...prev, dimension: v}
                            })
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

TerrainImporter.propTypes = {
    file: PropTypes.object,
    terrainSettings: PropTypes.object, setTerrainSettings: PropTypes.func
}