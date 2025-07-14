const mongoose = require('mongoose');

const COLOR_MAP = {
  "Red": "#ff0000",
  "Blue": "#0000ff",
  "Black": "#000000",
  "White": "#ffffff",
  "Grey": "#9e9e9e",
  "Green": "#008000",
  "Yellow": "#ffff00",
  "Pink": "#ffc0cb",
  "Lavender": "#b57edc",
  "Mint": "#98ff98",
  "Beige": "#f5f5dc",
  "Brick red": "#cb4154",
  "Coffee brown": "#4b3621",
  "Copper": "#b87333",
  "Flag Green": "#008000",
  "Flamingo": "#fc8eac",
  "Golden Yellow": "#ffd700",
  "Jade": "#00a86b",
  "Mushroom": "#b7a99a",
  "New Yellow": "#fff700",
  "Off white": "#f8f8ff",
  "Orange": "#ffa500",
  "Peach": "#ffe5b4",
  "Petrol Blue": "#355e7c",
  "Purple": "#800080",
  "Steel grey": "#43464b",
  "Coral": "#ff7f50",
  "Mustard yellow": "#ffdb58",
  "Maroon": "#800000",
  "Royal Blue": "#4169e1",
  "Charcoal Melange": "#36454f",
  "Sky Blue": "#87ceeb",
  "Grey Melange": "#b2beb5"
  // ...add all your color names and hex codes here
};

const uri = 'mongodb://localhost:27017/YOUR_DB_NAME'; // Change to your DB URI
const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model('product', productSchema);

async function updateColors() {
  await mongoose.connect(uri);

  const products = await Product.find({ 'colors.value': { $exists: false } });

  for (const product of products) {
    let updated = false;
    for (const color of product.colors) {
      if (!color.value && COLOR_MAP[color.name]) {
        color.value = COLOR_MAP[color.name];
        updated = true;
      }
    }
    if (updated) {
      await product.save();
      console.log(`Updated product: ${product._id}`);
    }
  }

  console.log('Done updating colors!');
  mongoose.disconnect();
}

updateColors(); 