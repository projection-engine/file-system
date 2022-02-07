export default function parseFileType(type){
    switch (type){
        case 'image': {
            return 'Image'
        }
        case 'skybox':{
            return 'Skybox'
        }
        case 'material':{
            return 'Material'
        }
        case 'obj':{
            return 'Mesh'
        }
        case 'gltf':{
            return 'Mesh'
        }
        default:
            return type
    }
}