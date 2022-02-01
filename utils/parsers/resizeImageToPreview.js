export default function resizeImageToPreview(data, callback) {
    let img = document.createElement("img");
    img.src = data
    img.onload = () => {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 256, 256);
        callback(canvas.toDataURL())
    }
}