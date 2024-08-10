const fs = require('fs');
const path = require('path');

class ProductManager {
    constructor(filePath) {
        this.filePath = path.resolve(__dirname, filePath);
    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return []; 
            } else {
                throw error; 
            }
        }
    }

    generateId() {
        return Date.now().toString(); 
    }

    async addProduct(product) {
        const products = await this.getProducts();
        const id = this.generateId();
        const newProduct = { id, ...product };
        products.push(newProduct);
        await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async updateProduct(id, updates) {
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updates };
            await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2)); 
            return products[index];
        }
        return null;
    }

    async deleteProduct(id) {
        const products = await this.getProducts(); 
        const index = products.findIndex(product => product.id === id);
        if (index !== -1) {
            const [deletedProduct] = products.splice(index, 1);
            await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2)); 
        }
        return null;
    }
}

module.exports = ProductManager;
