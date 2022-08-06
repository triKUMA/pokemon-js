import { CanvasContext, clearCanvas, initialiseCanvas } from "./canvas";
import keys, { Keys, currentPressedKeys } from "./input";
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

const animate = (
  ctx: CanvasContext,
  level: Sprite,
  player: Sprite,
  keys: Keys
) => {
  window.requestAnimationFrame(() => animate(ctx, level, player, keys));
  clearCanvas(ctx);

  drawSprite(level);
  drawSpriteCropped(player, {
    position: { x: 0, y: 0 },
    width: 12,
    height: 17,
  });

  let xVelocity = +keys.a.pressed - +keys.d.pressed || 0;
  let yVelocity = +keys.w.pressed - +keys.s.pressed || 0;

  // if (xVelocity !== 0 || yVelocity !== 0) {
  //   const magnitude = Math.sqrt(xVelocity * xVelocity + yVelocity * yVelocity);

  //   xVelocity /= magnitude;
  //   yVelocity /= magnitude;
  // }

  const lastPressedKey =
    currentPressedKeys[currentPressedKeys.length - 1] || "";
  if (xVelocity && (lastPressedKey === "a" || lastPressedKey === "d")) {
    level.position.x += xVelocity / 2;
  } else if (yVelocity && (lastPressedKey === "w" || lastPressedKey === "s")) {
    level.position.y += yVelocity / 2;
  }
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

  animate(ctx, level, player, keys);
}

main();
