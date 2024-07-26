const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');

const productManager = new ProductManager('products.json');

router.get('/', async (req, res) => {
  const products = await productManager.getAll();
  res.json(products);
});

router.get('/:pid', async (req, res) => {
  const product = await productManager.getById(req.params.pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

router.post('/', async (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;
  const newProduct = await productManager.addProduct({ title, description, code, price, status, stock, category, thumbnails });
  res.status(201).json(newProduct);
});

router.put('/:pid', async (req, res) => {
  const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
  if (updatedProduct) {
    res.json(updatedProduct);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

router.delete('/:pid', async (req, res) => {
  const result = await productManager.deleteProduct(req.params.pid);
  if (result) {
    res.json({ message: 'Product deleted' });
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

module.exports = router;
