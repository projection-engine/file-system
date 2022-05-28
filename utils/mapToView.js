export default function mapToView(folder, hook, bookmarks) {
    const items = hook.items,
        children = bookmarks ? [] : items.filter(i => i.isFolder && typeof i.parent === 'string' && i.parent === folder.id),
        childrenQuantity = children.length

    return {
        id: bookmarks ? folder.path : folder.id,
        label: folder.name,
        onClick: () => hook.setCurrentDirectory(bookmarks ? {...folder, id: folder.path} : folder),
        children: children.map(i => mapToView(i, hook)),
        draggable: true,
        icon: <span style={{fontSize: '1rem'}}
                    className={'material-icons-round'}>{childrenQuantity === 0 && !bookmarks ? 'folder_open' : 'source'}</span>,
        attributes: {'data-folder': bookmarks ? folder.path : folder.id},
        parent: folder.parent,
        isFolder: true
    }

}