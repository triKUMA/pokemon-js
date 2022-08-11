import Canvas, { clearCanvas } from "./canvas";
import Sprite, { drawFrame, drawOrigin, drawSpriteCropped } from "./sprite";
import { Position } from "./types/Position";
import { Size } from "./types/Size";
import {
  stripTilesetAncillaryData,
  TileMap,
  TileMapLayerDataCore,
  TileMapLayerDataCoreRecursive,
  TilesetCollection,
} from "./types/TileTypes";

// Takes an array of paths to tileset json files exported by Tiled. Takes these files and create a
// Tileset object from each and then returns them in a TilesetCollection, where the key for each
// Tileset object is the name of the tileset.
export const generateTilesets = async (
  tilesetPaths: string[]
): Promise<TilesetCollection> => {
  const tilesets: TilesetCollection = {};

  for (let i = 0; i < tilesetPaths.length; i++) {
    // Get the core data from the tileset json file. This removes any unwanted properties.
    const tilesetData = stripTilesetAncillaryData(
      await fetch(tilesetPaths[i]).then((res) => res.json())
    );

    // Create the Tileset object by attaching the data we just fetched, and adding a Sprite that
    // holds the matching tileset image.
    tilesets[tilesetData.name] = {
      data: tilesetData,
      sprite: await Sprite.create(`./img/tilesets/${tilesetData.image}`, {
        x: 0,
        y: 0,
      }),
    };
  }

  return tilesets;
};

// Render a whole tilemap to the canvas, based on the tilemap position.
export const renderTileMap = (
  tilemap: TileMap,
  tilesets: TilesetCollection
) => {
  // Render each layer in the tilemap successively, so that higher layers render above lower layers.
  tilemap.data.layers.forEach((layer, index) => {
    renderLayer(tilemap, layer, tilesets);
  });
};

// Render a layer, recursively calling the same function with nested layers.
export const renderLayer = (
  tilemap: TileMap,
  layer: TileMapLayerDataCoreRecursive | TileMapLayerDataCore,
  tilesets: TilesetCollection
) => {
  if ("layers" in layer) {
    layer.layers.forEach((subLayer, index) => {
      renderLayer(tilemap, subLayer, tilesets);
    });
  } else {
    renderData(tilemap, layer.data, tilesets);
  }
};

// Render layer data.
export const renderData = (
  tilemap: TileMap,
  data: number[],
  tilesets: TilesetCollection
) => {
  const canvas = Canvas.get();

  // Render each tile in a layer.
  data.forEach((tileIndex, index) => {
    // Calculate the position of the tile to render at.
    const position: Position = {
      x:
        tilemap.position.x -
        (tilemap.data.width * tilemap.data.tilewidth) / 2 +
        (index % tilemap.data.width) * tilemap.data.tilewidth,
      y:
        tilemap.position.y -
        (tilemap.data.height * tilemap.data.tileheight) / 2 +
        ~~(index / tilemap.data.width) * tilemap.data.tileheight,
    };

    // If the bounds of the tile is off the screen entirely, then skip rendering it.
    if (
      (position.x + canvas.origin.x) * canvas.pixelScale <
        -(canvas.element.width / 2) -
          tilemap.data.tilewidth * canvas.pixelScale ||
      (position.x + canvas.origin.x) * canvas.pixelScale >
        canvas.element.width / 2 + tilemap.data.tilewidth * canvas.pixelScale ||
      (position.y + canvas.origin.y) * canvas.pixelScale <
        -(canvas.element.height / 2) -
          tilemap.data.tileheight * canvas.pixelScale ||
      (position.y + canvas.origin.y) * canvas.pixelScale >
        canvas.element.height / 2 + tilemap.data.tileheight * canvas.pixelScale
    ) {
      return;
    }

    // Get the first valid tile ref.
    const tilesetRef = tilemap.data.tilesets.filter(
      (tilesetRef) => tilesetRef.firstgid <= tileIndex
    )[0];

    // If there is no valid tile ref, then it is an empty tile and rendering can be skipped.
    if (!tilesetRef) {
      return;
    }

    // Get the tileset that matches the tileset ref.
    const tileset = tilesets[tilesetRef.source];

    // Draw the correct tile from the tileset at the calculated position.
    drawFrame(
      tileset.sprite,
      position,
      {
        tileSize: {
          width: tileset.data.tilewidth,
          height: tileset.data.tileheight,
        },
        size: {
          width: tileset.data.columns,
          height: tileset.data.tilecount / tileset.data.columns,
        },
      },
      tileIndex - tilesetRef.firstgid
    );
  });
};
