import config from "./config";
import { initialiseCanvas, renderImage } from "./canvas";

function main() {
  const ctx = initialiseCanvas(config.width, config.height, config.margin);

  renderImage(ctx, "./img/Pellet Town.png");
}

main();
