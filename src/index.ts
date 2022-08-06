import { initialiseCanvas } from "./canvas";
import keys, { Keys } from "./input";
import Sprite, { drawSprite, drawSpriteCropped } from "./sprite";

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

const animate = (level: Sprite, player: Sprite, keys: Keys) => {
  window.requestAnimationFrame(() => animate(level, player, keys));
  drawSprite(level);
  drawSpriteCropped(player, {
    position: { x: 0, y: 0 },
    width: 12,
    height: 17,
  });

  const xVelocity = +keys.a.pressed - +keys.d.pressed;
  const yVelocity = +keys.w.pressed - +keys.s.pressed;

  level.position = {
    x: level.position.x + xVelocity,
    y: level.position.y + yVelocity,
  };
};

async function main() {
  const ctx = initialiseCanvas(
    config.canvas.width,
    config.canvas.height,
    config.canvas.margin
  );

  const level = await Sprite.load(ctx, config.level.imgSrc, {
    x: -181,
    y: -130,
  });
  const player = await Sprite.load(ctx, config.player.animationSrc.down, {
    x: config.canvas.width / 2,
    y: config.canvas.height / 2,
  });

  animate(level, player, keys);
}

main();
