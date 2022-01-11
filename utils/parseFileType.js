export default function parseFileType(type){
    switch (type){
        case 'jpeg':
        case 'pnj':{
            return 'Image'
        }
        case 'material':{
            return 'Material'
        }
        case 'obj':{
            return 'Mesh'
        }
        default:
            return type
    }
}