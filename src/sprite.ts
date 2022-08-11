import Canvas from "./canvas";
import { Position } from "./types/Position";
import { Size } from "./types/Size";

export interface SpriteImageCollection {
  [key: number]: HTMLImageElement;
}

class Sprite {
  // Collection of images at each scale resolution. Each image is generated only once, as needed.
  readonly images: SpriteImageCollection;
  // The position of the sprite to render to the canvas. This is in world coordinates, not screen coordinates.
  position: Position;

  private constructor(images: SpriteImageCollection, position: Position) {
    this.images = images;
    this.position = position;
  }

  // Create a new sprite from a given source path, with a position in the canvas.
  static async create(src: string, position: Position) {
    // Load the 1-to-1 pixel scale image.
    let images: SpriteImageCollection = {
      1: await Sprite.loadImage(src),
    };

    // Create sprite.
    const sprite = new Sprite(images, position);

    //Generate sprite's image at current canvas pixel scale.
    generateSpriteImgScaled(sprite, Canvas.get().pixelScale);

    // Attach an event listener to the canvas for when the pixel scale changes. The sprite image
    // will be generated at the new canvas pixel scale.
    Canvas.get().element.addEventListener("pixelscalechange", ((
      e: CustomEvent
    ) => {
      generateSpriteImgScaled(sprite, Canvas.get().pixelScale);
    }) as EventListener);

    // Create and return a new sprite with the upscaled image.
    return sprite;
  }

  // Wait until an image element has finished loading and then return it.
  private static loadImage(src: string) {
    const image = new Image();
    image.src = src;

    return new Promise<HTMLImageElement>((resolve) => {
      image.onload = () => {
        resolve(image);
      };
    });
  }
}

// ------------------- Credit -------------------
// Link: https://stackoverflow.com/questions/7809345/html5-canvas-is-there-a-way-to-resize-image-with-nearest-neighbour-resampling
// User: Polyducks (https://stackoverflow.com/users/4998471/polyducks)
// --------------------------------------------
// Resizes a provided image, based on the scale value. Returns a source path string to the newly
// scaled image.
const resizeNearestNeighbour = (img: HTMLImageElement, scale: number) => {
  //make shortcuts for image width and height
  var w = img.width;
  var h = img.height;

  //---------------------------------------------------------------
  //draw the original image to a new canvas
  //---------------------------------------------------------------

  //set up the canvas
  var c = document.createElement("canvas");
  var ctx = c.getContext("2d");
  if (!ctx) throw new Error("Sprite could not be resized.");
  //disable antialiasing on the canvas
  ctx.imageSmoothingEnabled = false;
  //size the canvas to match the input image
  c.width = w;
  c.height = h;
  //draw the input image
  ctx.drawImage(img, 0, 0);
  //get the input image as image data
  var inputImg = ctx.getImageData(0, 0, w, h);
  //get the data array from the canvas image data
  var data = inputImg.data;

  //---------------------------------------------------------------
  //resize the canvas to our bigger output image
  //---------------------------------------------------------------
  c.width = w * scale;
  c.height = h * scale;
  //---------------------------------------------------------------
  //loop through all the data, painting each pixel larger
  //---------------------------------------------------------------
  for (var i = 0; i < data.length; i += 4) {
    //set the fill colour
    ctx.fillStyle = `rgba(${data[i]}, ${data[i + 1]}, ${data[i + 2]}, ${
      data[i + 3]
    })`;

    //---------------------------------------------------------------
    //convert the index in the data array to x and y coordinates
    //---------------------------------------------------------------
    var index = i / 4;
    var x = index % w;
    //~~ is a faster way to do 'Math.floor'
    var y = ~~(index / w);
    //---------------------------------------------------------------
    //draw an enlarged rectangle on the enlarged canvas
    //---------------------------------------------------------------
    ctx.fillRect(x * scale, y * scale, scale, scale);
  }

  //get the output image from the canvas
  var output = c.toDataURL("image/png");
  //returns image data that can be plugged into an img tag's src
  return output;
};

// Generate a sprite's image at a certain scale, only if it hasnt already been generated.
const generateSpriteImgScaled = (sprite: Sprite, scale: number) => {
  if (!sprite.images[scale]) {
    sprite.images[scale] = new Image();
    sprite.images[scale].src = resizeNearestNeighbour(sprite.images[1], scale);
  }
};

// Draw a sprite's whole image to the canvas, based on its position value.
export const drawSprite = (sprite: Sprite) => {
  const canvas = Canvas.get();

  // If the sprite image has not yet been generated at the current canvas pixel scale, or the image
  // has yet to finish loading then do not try rendering it to the canvas.
  if (
    !sprite.images[canvas.pixelScale] ||
    !sprite.images[canvas.pixelScale].complete
  )
    return;

  // Get the current image to render.
  const spriteImg = sprite.images[canvas.pixelScale];

  // Calculate the origin offset value to render the image pixel perfect.
  const originOffset: Size = {
    width: (canvas.origin.x * canvas.pixelScale) % 1,
    height: (canvas.origin.y * canvas.pixelScale) % 1,
  };

  // Draw the whole image to the canvas.
  canvas.ctx.drawImage(
    // Image to draw
    spriteImg,
    // Crop area's top left corner (origin)
    0,
    0,
    // Crop area's width and height
    spriteImg.width,
    spriteImg.height,
    // Position on canvas to render image
    ~~(
      canvas.element.width / 2 +
      (sprite.position.x * canvas.pixelScale - spriteImg.width / 2)
    ) - originOffset.width,
    ~~(
      canvas.element.height / 2 +
      (sprite.position.y * canvas.pixelScale - spriteImg.height / 2)
    ) - originOffset.height,
    // Width and height of area to render image to on canvas (will scale image if values do not match crop
    // area's width and height)
    spriteImg.width,
    spriteImg.height
  );
};

// Details to describe how an image should be cropped.
interface CropDetails {
  origin: Position;
  size: Size;
}

// Draw a portion of a sprite's image, based on the provided crop details.
export const drawSpriteCropped = (sprite: Sprite, cropDetails: CropDetails) => {
  const canvas = Canvas.get();

  // If the sprite image has not yet been generated at the current canvas pixel scale, or the image
  // has yet to finish loading then do not try rendering it to the canvas.
  if (
    !sprite.images[canvas.pixelScale] ||
    !sprite.images[canvas.pixelScale].complete
  )
    return;

  // Get the current image to render.
  const spriteImg = sprite.images[canvas.pixelScale];

  // Calculate the origin offset value to render the image pixel perfect.
  const originOffset: Size = {
    width: (canvas.origin.x * canvas.pixelScale) % 1,
    height: (canvas.origin.y * canvas.pixelScale) % 1,
  };

  // Draw the cropped image to the canvas.
  canvas.ctx.drawImage(
    // Image to draw
    spriteImg,
    // Crop area's top left corner (origin)
    cropDetails.origin.x,
    cropDetails.origin.y,
    // Crop area's width and height
    cropDetails.size.width * canvas.pixelScale,
    cropDetails.size.height * canvas.pixelScale,
    // Position on canvas to render image
    ~~(
      canvas.element.width / 2 +
      (sprite.position.x - cropDetails.size.width / 2) * canvas.pixelScale
    ) - originOffset.width,
    ~~(
      canvas.element.height / 2 +
      (sprite.position.y - cropDetails.size.height / 2) * canvas.pixelScale
    ) - originOffset.height,
    // Width and height of area to render image to on canvas (will scale image if values do not match crop
    // area's width and height)
    cropDetails.size.width * canvas.pixelScale,
    cropDetails.size.height * canvas.pixelScale
  );
};

interface SpritesheetDetails {
  tileSize: Size;
}

// Draw a single frame from a spritesheet.
export const drawFrame = (
  sprite: Sprite,
  spritesheetDetails: SpritesheetDetails,
  frameIndex: number
) => {
  const canvas = Canvas.get();

  // If the sprite image has not yet been generated at the current canvas pixel scale, or the image
  // has yet to finish loading then do not try rendering it to the canvas.
  if (
    !sprite.images[canvas.pixelScale] ||
    !sprite.images[canvas.pixelScale].complete
  )
    return;

  // Get the current image to render.
  const spriteImg = sprite.images[canvas.pixelScale];

  // Get the size of a single tile in the spritesheet.
  const tileSize = spritesheetDetails.tileSize;

  // Determine how many tiles wide and tall the spritesheet is.
  const spritesheetSize: Size = {
    width: spriteImg.width / tileSize.width,
    height: spriteImg.height / tileSize.height,
  };

  // Determine the x and y value of the tile to render, determined from the spritesheet size.
  const frame = {
    x: frameIndex % spritesheetSize.width,
    y: Math.floor(frameIndex / spritesheetSize.height),
  };

  // Draw only the desired frame from the spritesheet.
  drawSpriteCropped(sprite, {
    origin: {
      x: frame.x * tileSize.width * canvas.pixelScale,
      y: frame.y * tileSize.height * canvas.pixelScale,
    },
    size: tileSize,
  });
};

// Draws a single black pixel at the sprite's origin.
const drawOrigin = (sprite: Sprite) => {
  const canvas = Canvas.get();
  canvas.ctx.fillStyle = "black";
  canvas.ctx.fillRect(
    sprite.position.x * canvas.pixelScale + canvas.element.width / 2,
    sprite.position.y * canvas.pixelScale + canvas.element.height / 2,
    canvas.pixelScale,
    canvas.pixelScale
  );
};

export default Sprite;
