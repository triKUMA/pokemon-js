export interface Keys {
  [key: string]: {
    pressed: boolean;
  };
}

const keys: Keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

export let currentPressedKeys: string[] = [];

window.addEventListener("keydown", (e) => {
  if (keys[e.key]) {
    keys[e.key].pressed = true;
    currentPressedKeys[currentPressedKeys.length] = e.key;
  }
});

window.addEventListener("keyup", (e) => {
  if (keys[e.key]) {
    keys[e.key].pressed = false;
    currentPressedKeys = currentPressedKeys.filter((key) => key !== e.key);
  }
});

export default keys;
