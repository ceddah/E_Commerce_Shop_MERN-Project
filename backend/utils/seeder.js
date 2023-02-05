const products = require('../data/product.json');
const Product = require('../Models/product');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');

dotenv.config({ path: 'backend/config/config.env' });
connectDatabase();

const seedProducts = async () => {
    try {
        await Product.deleteMany();
        await Product.insertMany(products);
        console.log('Seeder Initialized.');
        process.exit();
    } catch(err) {
        console.log(err.message);
        process.exit();
    }
}

seedProducts();