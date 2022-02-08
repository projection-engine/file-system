import Folder from "../../templates/Folder";

export default function mapToView(folder, hook) {

    return {
        id: folder.id,
        label: folder.name,
        onClick: () => hook.setCurrentDirectory(folder),
        children: mapToView(folder.children.filter(c => c.isFolder)),
        icon: <span style={{fontSize: '1rem'}} className={'material-icons-round'}>folder</span>,
        attributes: {'data-folder': folder.id}
    }

}