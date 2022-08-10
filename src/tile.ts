import Sprite from "./sprite";
import {
  stripTilesetAncillaryData,
  TilesetCollection,
} from "./types/TileTypes";

export const generateTilesets = (tilesetPaths: string[]): TilesetCollection => {
  const tilesets: TilesetCollection = {};

  tilesetPaths.forEach(async (tileset) => {
    const tilesetData = stripTilesetAncillaryData(
      await fetch(tileset).then((res) => res.json())
    );

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
