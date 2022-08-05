const setCanvasSize = (canvas: HTMLCanvasElement, aspectRatio: number) => {
  let desiredCanvasSize = {
    width: window.innerWidth,
    height: window.innerWidth * (1 / aspectRatio),
  };

  if (window.innerHeight < desiredCanvasSize.height) {
    desiredCanvasSize = {
      width: window.innerHeight * aspectRatio,
      height: window.innerHeight,
    };
  }

  canvas.width = desiredCanvasSize.width;
  canvas.height = desiredCanvasSize.height;
};

export const initialiseCanvas = (aspectRatio: number): HTMLCanvasElement => {
  const canvas = document.querySelector("canvas");

  if (!canvas) throw new Error("Canvas element could not be found.");

  setCanvasSize(canvas, aspectRatio);

  window.addEventListener("resize", () => {
    setCanvasSize(canvas, aspectRatio);
  });

  return canvas;
};
