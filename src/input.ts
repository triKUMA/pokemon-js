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

window.addEventListener("keydown", (e) => {
  if (keys[e.key]) keys[e.key].pressed = true;
});

window.addEventListener("keyup", (e) => {
  if (keys[e.key]) keys[e.key].pressed = false;
});

export default keys;
