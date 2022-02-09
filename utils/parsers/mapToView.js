import Folder from "../../templates/Folder";

export default function mapToView(folder, hook) {

    return {
        id: folder.id,
        label: folder.name,
        onClick: () => hook.setCurrentDirectory(folder),
        children: hook.items.filter(i => {

            return i.isFolder && typeof i.parent === 'string' && i.parent === folder.id
        }).map(i => mapToView(i, hook)),
        icon: <span style={{fontSize: '1rem'}} className={'material-icons-round'}>folder</span>,
        attributes: {'data-folder': folder.id},
        parent: folder.parent
    }

}