import { initialiseCanvas, renderImage } from "./canvas";

const ASPECT_RATIO = 16 / 9;
const MARGIN = 12;

function main() {
  const ctx = initialiseCanvas(ASPECT_RATIO, MARGIN);

  renderImage(ctx, "./img/Pellet Town.png");
}

main();
