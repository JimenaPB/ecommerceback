const express = require('express');
const { create } = require('express-handlebars');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const ProductManager = require('./managers/ProductManager');


const app = express();
const server = http.createServer(app);
const io = new Server(server);


const hbs = create({ extname: '.handlebars' });
app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', require('./routes/views'));


const productManager = new ProductManager('data/products.json');


io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('newProduct', async (product) => {
    await productManager.addProduct(product);
    const products = await productManager.getProducts();
    io.emit('updateProducts', products);
  });

  socket.on('deleteProduct', async (id) => {
    await productManager.deleteProduct(id);
    const products = await productManager.getProducts();
    io.emit('updateProducts', products);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});


server.listen(8080, () => {
  console.log('Servidor escuchando en el puerto 8080');
});
