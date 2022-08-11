import Canvas, { clearCanvas, translateCanvasOrigin } from "./canvas";
import input, { Input } from "./input";
import Sprite, { drawFrame } from "./sprite";
import {
  stripTileMapAncillaryData,
  TileMap,
  TilesetCollection,
} from "./types/TileTypes";
import { generateTilesets, renderTileMap } from "./tile";

// The game config object. This describes details about the game.
const config = {
  canvas: {
    aspectRatio: 4 / 3,
    pixelScale: 4,
    margin: 12,
  },
  level: {
    tilemap: "./data/tilemaps/pelletTown.json",
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
  tilemap: TileMap;
  input: Input;
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
  const tilesets = await generateTilesets(config.tilesets);

  // Create both the player and level.
  const player = await Sprite.create(config.player.animationSrc.down, {
    x: 0,
    y: 0,
  });

  const pelletTown: TileMap = {
    data: stripTileMapAncillaryData(
      await fetch(config.level.tilemap).then((res) => res.json())
    ),
    position: { x: 114, y: 20 },
  };
  // The game details needed for each game loop/frame.
  const details: GameDetails = {
    tilesets: tilesets,
    tilemap: pelletTown,
    input: input,
    player: player,
    playerSpeed: config.player.speed,
  };

  // Run the game loop.
  gameLoop(details);
}

// The game loop function. This runs on every frame of the game.
const gameLoop = (details: GameDetails) => {
  const { tilesets, tilemap, input, player } = details;
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
  renderTileMap(tilemap, tilesets);
  drawFrame(
    player,
    player.position,
    { size: { width: 4, height: 1 }, tileSize: { width: 12, height: 17 } },
    0
  );

  // Queue up the next game loop frame.
  window.requestAnimationFrame(() => gameLoop(details));
};

// Run the game.
main();
