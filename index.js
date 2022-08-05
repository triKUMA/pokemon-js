var ASPECT_SIZE = 16 / 9;
var initialiseCanvas = function () {
    var canvas = document.querySelector("canvas");
    if (!canvas)
        throw new Error("Canvas element could not be found.");
    console.log(canvas.width);
    var setCanvasSize = function () {
        var desiredCanvasSize = {
            width: window.innerWidth,
            height: window.innerWidth * (1 / ASPECT_SIZE)
        };
        if (window.innerHeight < desiredCanvasSize.height) {
            desiredCanvasSize = {
                width: window.innerHeight * ASPECT_SIZE,
                height: window.innerHeight
            };
        }
        canvas.width = desiredCanvasSize.width;
        canvas.height = desiredCanvasSize.height;
    };
    setCanvasSize();
    window.addEventListener("resize", function () {
        setCanvasSize();
    });
    return canvas;
};
function main() {
    var canvas = initialiseCanvas();
}
main();
