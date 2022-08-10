import Sprite from "./sprite";
import {
  stripTilesetAncillaryData,
  TilesetCollection,
} from "./types/TileTypes";

// Takes an array of paths to tileset json files exported by Tiled. Takes these files and create a
// Tileset object from each and then returns them in a TilesetCollection, where the key for each
// Tileset object is the name of the tileset.
export const generateTilesets = (tilesetPaths: string[]): TilesetCollection => {
  const tilesets: TilesetCollection = {};

  tilesetPaths.forEach(async (tileset) => {
    // Get the core data from the tileset json file. This removes any unwanted properties.
    const tilesetData = stripTilesetAncillaryData(
      await fetch(tileset).then((res) => res.json())
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
  });

  return tilesets;
};
