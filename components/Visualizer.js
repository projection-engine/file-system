import PropTypes from "prop-types";
import {Modal} from "@f-ui/core";

export default function Visualizer(props) {
    return (
        <Modal
            open={props.selected !== undefined} handleClose={() => {
            props.setSelected(undefined)
        }}>
            cafe
        </Modal>
    )
}
Visualizer.propTypes = {
    selected: PropTypes.string,
    setSelected: PropTypes.func
}