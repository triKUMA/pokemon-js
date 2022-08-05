export type CanvasContext = CanvasRenderingContext2D;

const clearCanvas = (ctx: CanvasContext) => {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

const setCanvasSize = (
  ctx: CanvasContext,
  aspectRatio: number,
  margin: number
) => {
  const marginDouble = 2 * margin;

  let desiredCanvasSize = {
    width: window.innerWidth - marginDouble,
    height: window.innerWidth * (1 / aspectRatio) - marginDouble,
  };

  if (window.innerHeight < desiredCanvasSize.height + marginDouble) {
    desiredCanvasSize = {
      width: window.innerHeight * aspectRatio - marginDouble,
      height: window.innerHeight - marginDouble,
    };
  }

  ctx.canvas.width = desiredCanvasSize.width;
  ctx.canvas.height = desiredCanvasSize.height;
  ctx.canvas.style.margin = `${margin}px`;

  clearCanvas(ctx);
};

export const initialiseCanvas = (
  aspectRatio: number,
  margin: number
): CanvasContext => {
  const canvas = document.querySelector("canvas");

  if (!canvas) throw new Error("The canvas element could not be found.");

  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("The canvas context could not be retrieved.");

  setCanvasSize(ctx, aspectRatio, margin);

  window.addEventListener("resize", () => {
    setCanvasSize(ctx, aspectRatio, margin);
  });

  return ctx;
};

export const renderImage = (ctx: CanvasContext, src: string) => {
  const image = new Image();
  image.src = src;
  image.onload = () => {
    ctx.drawImage(image, 0, 0);
  };
};
