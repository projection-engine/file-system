import {useEffect, useState} from "react";

export default function useBookmarks(fileSystem) {
    const [bookmarks, setBookmarks] = useState([])
    useEffect(() => {

            fileSystem.readFile(fileSystem.path + '\\bookmarks.meta', 'json')
                .then(res => {
                    if (res)
                        setBookmarks(res)
                })

    }, [])



    const addBookmark = (id) => {
        setBookmarks(prev => {
            const n = [...prev, {
                name: id.split('\\').pop(),
                path: id
            }]
            fileSystem.writeFile('\\bookmarks.meta', JSON.stringify(n)).then(e => console.log(e))
            return n
        })
    }
    const removeBookmark = (id) => {
        setBookmarks(prev => {
            const n = prev.filter(i => i.path !== id)
            fileSystem.writeFile('\\bookmarks.meta', JSON.stringify(n)).then(e => console.log(e))
            return n
        })
    }
    const renameBookmark = (id, newPath) => {
        setBookmarks(prev => {
            const p = prev.filter(i => i.path !== id)
            const n =  [...p, {
                name: newPath.split('\\').pop(),
                path: newPath
            }]
            fileSystem.writeFile('\\bookmarks.meta', JSON.stringify(n)).then(e => console.log(e))
            return n
        })
    }
    const removeBlock = (v) => {
        console.log(v)
        setBookmarks(prev => {
            const n = prev.filter(i => !v.includes(i.path))
            fileSystem.writeFile('\\bookmarks.meta', JSON.stringify(n)).then(e => console.log(e))
            return n
        })
    }
    return {
        bookmarks,

        removeBlock,
        addBookmark,
        removeBookmark,
        renameBookmark
    }
}