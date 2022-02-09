export default function mapToView(folder, hook) {
    const children = hook.items.filter(i => {

        return i.isFolder && typeof i.parent === 'string' && i.parent === folder.id
    }).map(i => mapToView(i, hook))
    const childrenQuantity = hook.items.filter(i => {
        return typeof i.parent === 'string' && i.parent === folder.id
    }).length

    return {
        id: folder.id,
        label: folder.name,
        onClick: () => hook.setCurrentDirectory(folder),
        children,

        icon: <span style={{fontSize: '1rem'}}
                    className={'material-icons-round'}>{childrenQuantity === 0 ? 'folder' : 'source'}</span>,
        attributes: {'data-folder': folder.id},
        parent: folder.parent
    }

}