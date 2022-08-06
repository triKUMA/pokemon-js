import { initialiseCanvas, renderImage } from "./canvas";

const config = {
  canvas: {
    width: 320,
    height: 180,
    margin: 12,
  },
  level: {
    imgSrc: "./img/Pellet Town.png",
  },
};

function main() {
  const ctx = initialiseCanvas(
    config.canvas.width,
    config.canvas.height,
    config.canvas.margin
  );

  renderImage(ctx, config.level.imgSrc, -150, -100);
}

main();
