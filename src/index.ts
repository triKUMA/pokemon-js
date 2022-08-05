import { initialiseCanvas, renderImage } from "./canvas";

const WIDTH = 320;
const HEIGHT = 180;
const MARGIN = 12;

function main() {
  const ctx = initialiseCanvas(WIDTH, HEIGHT, MARGIN);

  renderImage(ctx, "./img/Pellet Town.png");
}

main();
