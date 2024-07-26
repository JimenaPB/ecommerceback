const express = require('express');
const router = express.Router();
const CartManager = require('../managers/CartManager');

const cartManager = new CartManager('carts.json');

router.post('/', async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});

router.get('/:cid', async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: 'Cart not found' });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const updatedCart = await cartManager.addProductToCart(cid, pid);
  if (updatedCart) {
    res.json(updatedCart);
  } else {
    res.status(404).json({ error: 'Cart or Product not found' });
  }
});

module.exports = router;
