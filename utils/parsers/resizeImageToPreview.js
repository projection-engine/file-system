export default function resizeImageToPreview(data, callback) {
    let img = new Image();
    img.src = data
    img.onload = () => {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 256, 256);
        callback(canvas.toDataURL())
    }
}