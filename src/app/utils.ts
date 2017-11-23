try {
  const options = Object.defineProperty({}, "passive", {
    get: () => passiveSupported = true
  });

  window.addEventListener("test", null, options);
} catch(err) {}

export let passiveSupported: boolean;
