/* 
  Author: Vishaal Sowrirajan

  Overview of file :
  1. Get image promise - returns a promise that resolves when an image is loaded
*/

const getImagePromise = (image) => {
  return new Promise((resolve, _) => {
    image.onload = resolve;
  });
};