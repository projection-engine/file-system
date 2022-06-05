import PropTypes from "prop-types"
import styles from "../styles/Cards.module.css"
import React, {useMemo} from "react"
import Item from "./Item"
import useItems from "../hooks/useItems"
import {ContextMenu} from "@f-ui/core"
import SelectBox from "../../../../components/select-box/SelectBox"
import handleRename from "../utils/handleRename"
import useShortcuts from "../hooks/useShortcuts"

export default function View(props) {
    const {
        setCurrentItem, currentItem,
        filesToRender, ref,
        options ,
    } = useItems(props)

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


    return (
        <div
            id={"content-browser"}
            ref={ref}
            className={styles.content}
            data-folder-wrapper={props.hook.currentDirectory}

        >

            <ContextMenu
                options={options}
                onContext={(node) => {
                    if (node !== undefined && node !== null && (node.getAttribute("data-file") || node.getAttribute("data-folder"))) {
                        const attr = node.getAttribute("data-file") ? node.getAttribute("data-file") : node.getAttribute("data-folder")
                        props.setSelected([attr])
                    }
                }}
                className={styles.filesWrapper}
                styles={{
                    "--card_size": cardSize,
                    padding: props.visualizationType === 2 ? "0" : undefined, gap: props.visualizationType === 2 ? "0" : undefined,
                }}
                triggers={[
                    "data-folder-wrapper",
                    "data-file",
                    "data-folder"
                ]}
            >
                <SelectBox nodes={props.hook.items} selected={props.selected} setSelected={props.setSelected}/>
                {filesToRender.length > 0 ?
                    filesToRender.map((child, index) => (
                        <React.Fragment key={child.id}>
                            <Item
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
                    </div>}

            </ContextMenu>
        </div>
    )
}

View.propTypes = {
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
