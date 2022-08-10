import Sprite from "../sprite";

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
  tilewidth,
  tileheight,
  imagewidth,
  imageheight,
}: TilesetDataCore): TilesetDataCore => ({
  name,
  image,
  tilecount,
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

export interface TileMapData {
  compressionlevel: number;
  height: number;
  infinite: boolean;
  layers: TileMapLayerData[];
  nextlayerid: number;
  nextobjectid: number;
  orientation: string;
  renderorder: string;
  tiledversion: string;
  tileheight: number;
  tilesets: { firstgid: number; source: string }[];
  tilewidth: number;
  type: string;
  version: string;
  width: number;
}

export type TileMapDataCore = Pick<
  TileMapData,
  "tilewidth" | "tileheight" | "width" | "height" | "tilesets"
> & {
  layers: TileMapLayerDataCore[];
};

// Converts TileMapData type into TileMapDataCore type. This removes any unwanted properties not in TileMapDataCore.
export const stripTileMapAncillaryData = ({
  tilewidth,
  tileheight,
  width,
  height,
  tilesets,
  layers,
}: TileMapDataCore): TileMapDataCore => {
  const strippedLayers = layers.map((layer) =>
    stripTileMapLayerAncillaryData(layer)
  );

  tilesets = tilesets.map((tileset) => ({
    ...tileset,
    source: tileset.source.replace(".tsx", ""),
  }));

  return {
    tilewidth,
    tileheight,
    width,
    height,
    tilesets,
    layers: strippedLayers,
  } as TileMapDataCore;
};

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

export type TileMapLayerDataCore = Pick<
  TileMapLayerData,
  "width" | "height" | "visible" | "data"
>;

// Converts TileMapLayerData type into TileMapLayerDataCore type. This removes any unwanted properties not in TileMapLayerDataCore.
export const stripTileMapLayerAncillaryData = ({
  width,
  height,
  visible,
  data,
}: TileMapLayerDataCore): TileMapLayerDataCore => ({
  width,
  height,
  visible,
  data,
});
