
const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');

const productManager = new ProductManager('../data/products.json');

router.get('/products', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('index', { products });
});

router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
});

module.exports = router;   
