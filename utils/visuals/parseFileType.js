export default function parseFileType(type){
    switch (type){
        case 'pimg': {
            return 'Image'
        }

        case 'material':{
            return 'Material'
        }
        case 'mesh':{
            return 'Mesh'
        }

        default:
            return type
    }
}