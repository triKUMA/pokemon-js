export interface Input {
  [key: string]: KeyDetails;
}

export interface KeyDetails {
  pressed: boolean;
}

// Object containing all tracked keys, as well as whether the keys are currently pressed.
const input: Input = {
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

// Set a key's pressed value to true.
window.addEventListener("keydown", (e) => {
  input[e.key] = { ...input[e.key], pressed: true };
});

// Set a key's pressed value to false.
window.addEventListener("keyup", (e) => {
  input[e.key] = { ...input[e.key], pressed: false };
});

export default input;
