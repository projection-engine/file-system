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
        case 'flow':{
            return 'Flow script'
        }
        default:
            return type
    }
}