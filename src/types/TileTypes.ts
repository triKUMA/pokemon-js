import Sprite from "../sprite";
import { Position } from "./Position";

export interface TilesetData {
  columns: number;
  image: string;
  imageheight: number;
  imagewidth: number;
  margin: number;
  name: string;
  spacing: number;
  tilecount: number;
  tiledversion: string;
  tileheight: number;
  tilewidth: number;
  type: string;
  version: string;
}

export type TilesetDataCore = Pick<
  TilesetData,
  | "name"
  | "image"
  | "tilecount"
  | "columns"
  | "tilewidth"
  | "tileheight"
  | "imagewidth"
  | "imageheight"
>;

// Converts TilesetData type into TilesetDataCore type. This removes any unwanted properties not in TilesetDataCore.
export const stripTilesetAncillaryData = ({
  name,
  image,
  tilecount,
  columns,
  tilewidth,
  tileheight,
  imagewidth,
  imageheight,
}: TilesetDataCore): TilesetDataCore => ({
  name,
  image,
  tilecount,
  columns,
  tilewidth,
  tileheight,
  imagewidth,
  imageheight,
});

export interface Tileset {
  data: TilesetDataCore;
  sprite: Sprite;
}

export interface TilesetCollection {
  [name: string]: Tileset;
}

export interface TileMapData extends TileMapLayerDataRecursive {
  compressionlevel: number;
  height: number;
  infinite: boolean;
  nextlayerid: number;
  nextobjectid: number;
  orientation: string;
  renderorder: string;
  tiledversion: string;
  tileheight: number;
  tilesets: TilesetRef[];
  tilewidth: number;
  type: string;
  version: string;
  width: number;
}

export interface TilesetRef {
  source: string;
  firstgid: number;
}

export type TileMapDataCore = Pick<
  TileMapData,
  "tilewidth" | "tileheight" | "width" | "height" | "tilesets"
> &
  TileMapLayerDataCoreRecursive;

// Converts TileMapData type into TileMapDataCore type. This removes any unwanted properties not in TileMapDataCore.
export const stripTileMapAncillaryData = (
  tilemapData: TileMapData
): TileMapDataCore => {
  const strippedLayers = tilemapData.layers.map((layer) =>
    stripTileMapLayerAncillaryData(layer)
  );

  const tilesets = tilemapData.tilesets.map((tileset) => ({
    ...tileset,
    source: tileset.source.replace(".tsx", ""),
  }));

  return {
    tilewidth: tilemapData.tilewidth,
    tileheight: tilemapData.tileheight,
    width: tilemapData.width,
    height: tilemapData.height,
    tilesets: tilesets,
    layers: strippedLayers,
  } as TileMapDataCore;
};

export interface TileMapLayerDataRecursive {
  layers: (TileMapLayerDataRecursive | TileMapLayerData)[];
}

export interface TileMapLayerData {
  data: number[];
  height: number;
  id: number;
  name: string;
  opacity: number;
  type: string;
  visible: boolean;
  width: number;
  x: number;
  y: number;
}

export interface TileMapLayerDataCoreRecursive {
  layers: (TileMapLayerDataCoreRecursive | TileMapLayerDataCore)[];
}

export type TileMapLayerDataCore = Pick<
  TileMapLayerData,
  "width" | "height" | "visible" | "data" | "name"
>;

// Converts TileMapLayerData type into TileMapLayerDataCore type. This removes any unwanted
// properties not in TileMapLayerDataCore. This includes recursive processing for nested TileMapLayerData.
export const stripTileMapLayerAncillaryData = (
  layer: TileMapLayerDataRecursive | TileMapLayerData
): TileMapLayerDataCoreRecursive | TileMapLayerDataCore => {
  if ("layers" in layer) {
    const strippedLayers = layer.layers.map((l) =>
      stripTileMapLayerAncillaryData(l)
    );

    return {
      layers: strippedLayers,
    };
  }

  return {
    width: layer.width,
    height: layer.height,
    visible: layer.visible,
    data: layer.data,
    name: layer.name,
  };
};

export interface TileMap {
  data: TileMapDataCore;
  position: Position;
}
