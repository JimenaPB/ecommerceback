const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const productManager = new ProductManager('data/products.json'); 
const Joi = require('joi');


const productSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  code: Joi.string().required(),
  price: Joi.number().required(),
  status: Joi.boolean().required(),
  stock: Joi.number().required(),
  category: Joi.string().required(),
  thumbnails: Joi.array().items(Joi.string()).optional(),
});


router.get('/', async (req, res) => {
  try {
    const products = await productManager.getAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});


router.get('/:pid', async (req, res) => {
  try {
    const product = await productManager.getById(req.params.pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product' });
  }
});


router.post('/', async (req, res) => {
  const { error, value } = productSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const newProduct = await productManager.addProduct(value); 
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


router.put('/:pid', async (req, res) => {
  const { error, value } = productSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const updatedProduct = await productManager.updateProduct(req.params.pid, value);
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});


router.delete('/:pid', async (req, res) => {
  try {
    const result = await productManager.deleteProduct(req.params.pid);
    if (result) {
      res.json({ message: 'Product deleted' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting product' });
  }
});

module.exports = router;
