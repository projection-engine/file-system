import PropTypes from "prop-types"
import styles from "../styles/Cards.module.css"
import React, {useMemo} from "react"
import File from "./File"
import useItems from "../hooks/useItems"
import SelectBox from "../../../../components/select-box/SelectBox"
import handleRename from "../utils/handleRename"
import useShortcuts from "../hooks/useShortcuts"
import useContextTarget from "../../../../components/context/hooks/useContextTarget"
import getFileOptions from "../utils/getFileOptions"

const TRIGGERS = [
    "data-wrapper",
    "data-file",
    "data-folder"
]
export default function Files(props) {
    const {
        setCurrentItem, currentItem,
        filesToRender, 
    } = useItems(props)
    const options = useMemo(() => {
        return getFileOptions(props.hook, setCurrentItem, props.bookmarksHook)
    }, [props.hook.items, props.hook.currentDirectory, props.searchString])
    const cardSize = useMemo(() => {
        switch (props.visualizationType){
        case 1:
            return "75px"
        case 2:
            return "100%"
        default:
            return "115px"
        }
    }, [props.visualizationType])
    useShortcuts(props.hook, props.bookmarksHook, props.selected, props.setSelected)

    useContextTarget(
        {id: "content-browser", label: "Content Browser", icon: "folder"},
        options,
        TRIGGERS
    )
    return (
        <div
            id={"content-browser"}
            className={styles.content}
            data-wrapper={"WRAPPER"}
        >
            <div
                className={styles.filesWrapper}
                style={{
                    "--card_size": cardSize,
                    padding: props.visualizationType === 2 ? "0" : undefined, gap: props.visualizationType === 2 ? "0" : undefined,
                }}
            >
                <SelectBox nodes={props.hook.items} selected={props.selected} setSelected={props.setSelected}/>
                {filesToRender.length > 0 ?
                    filesToRender.map((child, index) => (
                        <React.Fragment key={child.id}>
                            <File
                                index={index}
                                reset={() => {
                                    props.setSelected([])
                                    props.setSearchString("")
                                    props.setFileType(undefined)
                                }}
                                type={child.isFolder ? 0 : 1}
                                data={child}
                                childrenQuantity={child.children}
                                selected={props.selected}
                                setSelected={(e) => props.setSelected(prev => {
                                    if(e) {
                                        if (e.ctrlKey)
                                            return [...prev, child.id]
                                        else
                                            return [child.id]
                                    }
                                    else
                                        return  []
                                })}
                                hook={props.hook}
                                onRename={currentItem}

                                visualizationType={props.visualizationType}
                                submitRename={name => handleRename(child, name, props.hook,setCurrentItem, props.bookmarksHook)}
                            />
                        </React.Fragment>
                    ))
                    :
                    <div className={styles.empty}>
                        <span className={"material-icons-round"} style={{fontSize: "100px"}}>folder</span>
                        <div style={{fontSize: ".8rem"}}>
                            Empty folder
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

Files.propTypes = {
    fileType: PropTypes.string,
    setFileType: PropTypes.func,

    searchString: PropTypes.string,
    setSearchString: PropTypes.func,


    visualizationType: PropTypes.number,

    bookmarksHook: PropTypes.object,
    selected: PropTypes.array,
    setSelected: PropTypes.func,
    hook: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired
}
