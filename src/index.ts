import { initialiseCanvas } from "./canvas";
import Sprite, { drawSprite } from "./sprite";

const config = {
  canvas: {
    width: 250,
    height: 180,
    margin: 12,
  },
  level: {
    imgSrc: "./img/Pellet Town.png",
  },
  player: {
    animationSrc: {
      up: "./img/playerUp.png",
      down: "./img/playerDown.png",
      left: "./img/playerLeft.png",
      right: "./img/playerRight.png",
    },
  },
};

async function main() {
  const ctx = initialiseCanvas(
    config.canvas.width,
    config.canvas.height,
    config.canvas.margin
  );

  const level = await Sprite.load(ctx, config.level.imgSrc, {
    x: -175,
    y: -125,
  });
  const player = await Sprite.load(ctx, config.player.animationSrc.up, {
    x: 0,
    y: 0,
  });

  drawSprite(level);
  drawSprite(player);
}

main();
