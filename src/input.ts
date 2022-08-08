export interface Keys {
  [key: string]: {
    pressed: boolean;
  };
}

// Object containing all tracked keys, as well as whether the keys are currently pressed.
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

// Set a tracked key's pressed value to true.
window.addEventListener("keydown", (e) => {
  if (keys[e.key]) {
    keys[e.key].pressed = true;
  }
});

// Set a tracked key's pressed value to false.
window.addEventListener("keyup", (e) => {
  if (keys[e.key]) {
    keys[e.key].pressed = false;
  }
});

export default keys;
