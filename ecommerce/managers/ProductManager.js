const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getAll() {
    const data = await fs.readFile(this.path, 'utf-8');
    return JSON.parse(data);
  }

  async getById(id) {
    const products = await this.getAll();
    return products.find(product => product.id === id);
  }

  async addProduct(product) {
    const products = await this.getAll();
    const newProduct = { id: uuidv4(), ...product };
    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async updateProduct(id, updates) {
    const products = await this.getAll();
    const index = products.findIndex(product => product.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
      return products[index];
    }
    return null;
  }

  async deleteProduct(id) {
    const products = await this.getAll();
    const index = products.findIndex(product => product.id === id);
    if (index !== -1) {
      const deletedProduct = products.splice(index, 1);
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
      return deletedProduct;
    }
    return null;
  }
}

module.exports = ProductManager;
