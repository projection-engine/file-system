export default function resizeImageToPreview(data, callback) {
    let img = new Image();
    img.src = data
    img.onload = () => {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        getDimensions(img.naturalWidth,  img.naturalHeight, 256, 256)
        ctx.drawImage(img, 0, 0, 256, 256);
        callback(canvas.toDataURL())
    }
}
function getDimensions(srcWidth, srcHeight, maxWidth, maxHeight) {
    let ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    return { width: srcWidth*ratio, height: srcHeight*ratio };
}