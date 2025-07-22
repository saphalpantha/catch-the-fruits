const fruits = ['apple', 'banana', 'blueberry', 'mango', 'pear', 'strawberry', 'watermelon'];

export function loadImage(type) {
  const image = new Image();
  if (type === 'bomb') {
    image.src = '/assets/bomb.png';
  } else if (type === 'fruit') {
    const randomIndex = Math.floor(Math.random() * fruits.length);
    image.src = `/assets/fruits/${fruits[randomIndex]}.png`;
  } else if (type === 'basket') {
    image.src = '/assets/basket.png';
  }

  return image;
}
