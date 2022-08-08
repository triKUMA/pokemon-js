import { Position } from "./types/Position";
import { Size } from "./types/Size";

class Canvas {
  // The global canvas singleton instance.
  private static instace: Canvas | null;
  // The html canvas element.
  element: HTMLCanvasElement;
  // The size of the canvas screen, in world coordinates.
  size: Size;
  // The canvas context.
  ctx: CanvasRenderingContext2D;
  // The current canvas pixel scale.
  pixelScale: number;
  // The base pixel scale the current pixel scale is calculated from.
  desiredPixelScale: number;

  private constructor(
    element: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    pixelScale: number
  ) {
    this.element = element;
    this.ctx = ctx;

    this.size = { width: 0, height: 0 };
    this.desiredPixelScale = pixelScale;
    this.pixelScale = pixelScale;
  }

  // Initialise the canvas singleton.
  static initialise(
    aspectRatio: number,
    pixelScale: number,
    margin: number
  ): Canvas {
    // Only initialise the canvas if the instance has not been set yet.
    if (!Canvas.instace) {
      // Get the canvas element.
      const canvas = document.querySelector("canvas");
      if (!canvas) throw new Error("The canvas element could not be found.");

      // Get the canvas context.
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("The canvas context could not be retrieved.");

      // Set the canvas instance.
      Canvas.instace = new Canvas(canvas, ctx, pixelScale);

      // Calculate the size of the canvas.
      canvas.style.margin = `${margin}px`;
      setCanvasSize(aspectRatio, margin);

      // Attach a resize event listener to the window, so that the canvas size is recalculated every
      // time the window is resized.
      window.addEventListener("resize", () => {
        // Update canvas size.
        setCanvasSize(aspectRatio, margin);
      });
    }

    // Return the canvas singleton.
    return Canvas.get();
  }

  // Get the canvas singleton. This typechecks the canvas instance so that it is not type null.
  static get(): Canvas {
    if (!Canvas.instace)
      throw new Error(
        "Canvas has not been initialised correctly. Try calling Canvas.initialise() at the start of your script."
      );

    return Canvas.instace;
  }
}

// Update the canvas size based on the size of the window.
const setCanvasSize = (aspectRatio: number, margin: number) => {
  const marginDouble = 2 * margin;

  // Calculate the desired size using the full width of the scren.
  let desiredCanvasSize = {
    width: window.innerWidth - marginDouble,
    height: window.innerWidth * (1 / aspectRatio) - marginDouble,
  };

  // If the height overflows based on the current desired size, recalculate the desired size using
  // full height of the screen.
  if (window.innerHeight < desiredCanvasSize.height + marginDouble) {
    desiredCanvasSize = {
      width: window.innerHeight * aspectRatio - marginDouble,
      height: window.innerHeight - marginDouble,
    };
  }

  const canvas = Canvas.get();

  // Set the screen size of the canvas.
  canvas.element.width = desiredCanvasSize.width;
  canvas.element.height = desiredCanvasSize.height;

  // Set the world size of the canvas.
  canvas.size.width = ~~(desiredCanvasSize.width / canvas.pixelScale);
  canvas.size.height = ~~(desiredCanvasSize.height / canvas.pixelScale);

  // Get the current pixel scale and calculate the new pixel scale of the window.
  const prevPixelScale = canvas.pixelScale;
  canvas.pixelScale = ~~(
    1 +
    canvas.desiredPixelScale * (canvas.element.height / 800)
  );

  // If the updated pixel scale is different to the previous one, fire a 'pixelscalechange' event.
  if (prevPixelScale !== canvas.pixelScale) {
    const pixelScaleEvent = new CustomEvent("pixelscalechange");
    canvas.element.dispatchEvent(pixelScaleEvent);
  }
};

// Clear the canvas with a provided style, with the default being black.
export const clearCanvas = (style: string = "black") => {
  const canvas = Canvas.get();
  canvas.ctx.fillStyle = style;
  canvas.ctx.fillRect(0, 0, canvas.element.width, canvas.element.height);
};

// Convert a world position to a screen position.
export const worldPosToScreenPos = (position: Position): Position => {
  return {
    x: position.x * Canvas.get().pixelScale,
    y: position.y * Canvas.get().pixelScale,
  };
};

export default Canvas;
