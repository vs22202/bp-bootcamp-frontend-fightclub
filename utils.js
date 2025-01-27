const getImagePromise = (image) => {
  return new Promise((resolve, _) => {
    image.onload = resolve;
  });
};