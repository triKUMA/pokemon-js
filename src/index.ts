import Canvas, { clearCanvas } from "./canvas";
import keys, { Keys } from "./input";
import Sprite, { drawFrame, drawSprite } from "./sprite";

// The game config object. This describes details about the game.
const config = {
  canvas: {
    aspectRatio: 4 / 3,
    pixelScale: 5,
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
    speed: 2,
  },
};

// The main game function, which initialises and runs the game.
async function main() {
  // Initialise the canvas.
  const canvas = Canvas.initialise(
    config.canvas.aspectRatio,
    config.canvas.pixelScale,
    config.canvas.margin
  );

  // Create both the level and player sprites.
  const level = await Sprite.create(config.level.imgSrc, {
    x: 0,
    y: 0,
  });
  const player = await Sprite.create(config.player.animationSrc.down, {
    x: 0,
    y: 0,
  });

  // Run the game loop.
  gameLoop(level, player, config.player.speed, keys);
}

// The game loop function. This runs on every frame of the game.
const gameLoop = (level: Sprite, player: Sprite, speed: number, keys: Keys) => {
  // Clear the canvas with black, to reset the view for this frame's
  clearCanvas();

  // Calculate the x and y velocity of the player.
  let xVelocity = +keys.a.pressed - +keys.d.pressed || 0;
  let yVelocity = +keys.w.pressed - +keys.s.pressed || 0;

  // If the player velocity is not zero, normalise the velocity vector to unit length.
  if (xVelocity !== 0 || yVelocity !== 0) {
    // Calculate the velocity vector's magnitude (length).
    const magnitude = Math.sqrt(xVelocity * xVelocity + yVelocity * yVelocity);

    // Normalise the velocity.
    xVelocity /= magnitude;
    yVelocity /= magnitude;
  }

  // Update the player's position, based on the velocity.
  level.position = {
    x: level.position.x + xVelocity / 2,
    y: level.position.y + yVelocity / 2,
  };

  // Render the level and player to the screen.
  drawSprite(level);
  drawFrame(player, { tileSize: { width: 12, height: 17 } }, 0);

  // Queue up the next game loop frame.
  window.requestAnimationFrame(() => gameLoop(level, player, speed, keys));
};

// Run the game.
main();
