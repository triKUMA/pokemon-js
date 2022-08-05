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

export const initialiseCanvas = (
  aspectRatio: number
): CanvasRenderingContext2D => {
  const canvas = document.querySelector("canvas");

  if (!canvas) throw new Error("The canvas element could not be found.");

  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("The canvas context could not be retrieved.");

  setCanvasSize(ctx.canvas, aspectRatio);

  window.addEventListener("resize", () => {
    setCanvasSize(ctx.canvas, aspectRatio);
  });

  return ctx;
};
