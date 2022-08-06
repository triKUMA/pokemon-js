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

export default Sprite;
