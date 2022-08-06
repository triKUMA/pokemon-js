export type CanvasContext = CanvasRenderingContext2D;

const setCanvasScale = (ctx: CanvasContext, margin: number) => {
  const marginDouble = 2 * margin;

  const widthScale = (window.innerWidth - marginDouble) / ctx.canvas.width;
  const heightScale = (window.innerHeight - marginDouble) / ctx.canvas.height;

  ctx.canvas.style.scale = `${Math.min(widthScale, heightScale)}`;
};

export const initialiseCanvas = (
  width: number,
  height: number,
  margin: number
): CanvasContext => {
  const canvas = document.querySelector("canvas");

  if (!canvas) throw new Error("The canvas element could not be found.");

  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("The canvas context could not be retrieved.");

  ctx.canvas.width = width;
  ctx.canvas.height = height;
  ctx.canvas.style.margin = `${margin}px`;

  setCanvasScale(ctx, margin);

  window.addEventListener("resize", () => {
    setCanvasScale(ctx, margin);
  });

  return ctx;
};

export const clearCanvas = (ctx: CanvasContext) => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};
