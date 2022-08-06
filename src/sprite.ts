import { CanvasContext } from "./canvas";
import { Position } from "./types/Position";

class Sprite {
  ctx: CanvasContext;
  position: Position;
  image: HTMLImageElement;

  private constructor(ctx: CanvasContext, src: string, position: Position) {
    this.ctx = ctx;
    this.position = position;

    this.image = new Image();
    this.image.src = src;
  }

  static load(ctx: CanvasContext, src: string, position: Position) {
    const sprite = new Sprite(ctx, src, position);

    return new Promise<Sprite>((resolve) => {
      sprite.image.onload = () => {
        resolve(sprite);
      };
    });
  }
}

export const drawSprite = (sprite: Sprite) => {
  sprite.ctx.drawImage(sprite.image, sprite.position.x, sprite.position.y);
};

interface CropDetails {
  position: Position;
  width: number;
  height: number;
}

export const drawSpriteCropped = (sprite: Sprite, cropDetails: CropDetails) => {
  sprite.ctx.drawImage(
    sprite.image,
    cropDetails.position.x,
    cropDetails.position.y,
    cropDetails.width,
    cropDetails.height,
    sprite.position.x,
    sprite.position.y,
    cropDetails.width,
    cropDetails.height
  );
};

const drawOrigin = (sprite: Sprite) => {
  sprite.ctx.fillStyle = "black";
  sprite.ctx.fillRect(sprite.position.x, sprite.position.y, 1, 1);
};

export default Sprite;
