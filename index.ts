const ASPECT_SIZE = 16 / 9;

const initialiseCanvas = (): HTMLCanvasElement => {
  const canvas = document.querySelector("canvas");

  if (!canvas) throw new Error("Canvas element could not be found.");

  console.log(canvas.width);

  const setCanvasSize = () => {
    let desiredCanvasSize = {
      width: window.innerWidth,
      height: window.innerWidth * (1 / ASPECT_SIZE),
    };

    if (window.innerHeight < desiredCanvasSize.height) {
      desiredCanvasSize = {
        width: window.innerHeight * ASPECT_SIZE,
        height: window.innerHeight,
      };
    }

    canvas.width = desiredCanvasSize.width;
    canvas.height = desiredCanvasSize.height;
  };

  setCanvasSize();

  window.addEventListener("resize", () => {
    setCanvasSize();
  });

  return canvas;
};

function main() {
  const canvas = initialiseCanvas();
}

main();
