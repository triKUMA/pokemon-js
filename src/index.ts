import Canvas, { clearCanvas, translateCanvasOrigin } from "./canvas";
import input, { Input } from "./input";
import Sprite, { drawFrame, drawSprite } from "./sprite";
import { TilesetCollection } from "./types/TileTypes";
import { generateTilesets } from "./tile";

// The game config object. This describes details about the game.
const config = {
  canvas: {
    aspectRatio: 4 / 3,
    pixelScale: 4,
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
    speed: 5,
  },
  tilesets: [
    "./data/tilesets/collisionTileset.json",
    "./data/tilesets/pokemonStyleGameTileset.json",
  ],
};

interface GameDetails {
  tilesets: TilesetCollection;
  input: Input;
  level: Sprite;
  player: Sprite;
  playerSpeed: number;
}

// The main game function, which initialises and runs the game.
async function main() {
  // Initialise the canvas.
  const canvas = Canvas.initialise(
    config.canvas.aspectRatio,
    config.canvas.pixelScale,
    config.canvas.margin
  );

  // Generate the tileset objects for the game, which tilemaps reference to draw their data to the screen.
  const tilesets = generateTilesets(config.tilesets);

  // Create both the level and player sprites.
  const level = await Sprite.create(config.level.imgSrc, {
    x: 107.5,
    y: 15,
  });
  const player = await Sprite.create(config.player.animationSrc.down, {
    x: 0,
    y: 0,
  });

  // The game details needed for each game loop/frame.
  const details: GameDetails = {
    tilesets: tilesets,
    input: input,
    level: level,
    player: player,
    playerSpeed: config.player.speed,
  };

  // Run the game loop.
  gameLoop(details);
}

// The game loop function. This runs on every frame of the game.
const gameLoop = (details: GameDetails) => {
  const { tilesets, input, level, player } = details;
  const playerSpeed = details.playerSpeed / 10;

  // Clear the canvas with black, to reset the view for this frame's
  clearCanvas();

  // Calculate the x and y velocity of the player.
  let xVelocity = +input.a.pressed - +input.d.pressed || 0;
  let yVelocity = +input.w.pressed - +input.s.pressed || 0;

  // If the player velocity is not zero, normalise the velocity vector to unit length.
  if (xVelocity !== 0 || yVelocity !== 0) {
    // Calculate the velocity vector's magnitude (length).
    const magnitude = Math.sqrt(xVelocity * xVelocity + yVelocity * yVelocity);

    // Normalise the velocity.
    xVelocity /= magnitude;
    yVelocity /= magnitude;
  }

  xVelocity *= playerSpeed;
  yVelocity *= playerSpeed;

  // Update the player's position, based on the velocity.
  player.position = {
    x: player.position.x - xVelocity,
    y: player.position.y - yVelocity,
  };

  // Update canvas origin to be on player, so canvas always tracks the player.
  translateCanvasOrigin(xVelocity, yVelocity);

  // Render the level and player to the screen.
  drawSprite(level);
  drawFrame(player, { tileSize: { width: 12, height: 17 } }, 0);

  // Queue up the next game loop frame.
  window.requestAnimationFrame(() => gameLoop(details));
};

// Run the game.
main();
