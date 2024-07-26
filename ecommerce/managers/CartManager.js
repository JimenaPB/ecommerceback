const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getAll() {
    const data = await fs.readFile(this.path, 'utf-8');
    return JSON.parse(data);
  }

  async getCartById(id) {
    const carts = await this.getAll();
    return carts.find(cart => cart.id === id);
  }

  async createCart() {
    const carts = await this.getAll();
    const newCart = { id: uuidv4(), products: [] };
    carts.push(newCart);
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getAll();
    const cart = carts.find(cart => cart.id === cartId);
    if (!cart) return null;

    const product = cart.products.find(p => p.product === productId);
    if (product) {
      product.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return cart;
  }
}

module.exports = CartManager;
