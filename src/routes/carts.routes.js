import express from 'express';
import fs from 'fs';

// generacion de la ultima id 

  const getLastId = (items) => {
    if (items.length === 0) {
      return 1;
    }
    const lastItem = items[items.length - 1];
    return lastItem.id + 1;
  };

// const de router y paths

  const router = express.Router();

  const cartsPath = './carrito.json';
  const productsPath = './productos.json';

// Función para leer un archivo JSON

  const readJSONFile = (filePath) => {
    try {
      if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
      }
      else {
        const data = [];
        return data;
      }
    } catch (error) {
      return [error];
    }};

// Función para escribir en un archivo JSON

  const writeJSONFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  };

// *********************************************************************
// *                     Rutas para carritos                           *
// *********************************************************************

  // GET para retornar un carrito x su ID

    router.get('/carts/:cid', (req, res) => {
      const carts = readJSONFile(cartsPath);
      const cartId = parseInt(req.params.cid);
      const cart = carts.find(c => c.id == cartId);
      res.setHeader('Content-Type','application/json');
      if (cart) {
        res.json(cart);
      } else {
        res.status(404).send('Carrito no encontrado');
      }
      });

  // POST para agregar un producto a un carrito existente

    router.post('/carts/:cid/product/:pid', (req, res) => {
      const carts = readJSONFile(cartsPath);
      const cartId = parseInt(req.params.cid);
      const productId = parseInt(req.params.pid);
      const quantity = 1;
   
    // Verificar si el carrito  existe en carritos.json

      let cart = null;
      cart = carts.find(c => c.id == cartId);
    
        if (!cart) {
          res.setHeader('Content-Type','application/json');
          res.status(404).send('Carrito no encontrado');
          return;
        }

    // Verificar si el producto existe en products.json 

        const products = readJSONFile(productsPath);
        const product = products.find(p => p.id == productId);
            
        if (!product) {
        res.setHeader('Content-Type','application/json');
        res.status(404).send('Producto no encontrado');
        return;
        }

    // actualizar el carrito y grabarlo

        const existingProduct = cart.products.find(p => p.product == productId);
    
        if (existingProduct) {
        existingProduct.quantity += quantity;
        } else {
        cart.products.push({ product: productId, quantity });
        }
  
        writeJSONFile(cartsPath, carts);

        res.setHeader('Content-Type','application/json');
        res.status(201).json(cart);
    });

  //  POST para crear un carrito nuevo

    router.post('/carts/product/:pid', (req, res) => {
      const carts = readJSONFile(cartsPath);
      const productId = parseInt(req.params.pid);
      const quantity = 1;
      let cart = null;  
      
      // Verificar si el producto existe en products.json
        const products = readJSONFile(productsPath);
        const product = products.find(p => p.id == productId);
          if (!product) {
          res.setHeader('Content-Type','application/json');
          res.status(404).send('Producto no encontrado');
          return;
          }

      // crear el carrito y grabarlo

        let cartid= getLastId(carts);
        cart = { id: cartid, products : [{"product": productId, "quantity":quantity}]};
        carts.push({ id: cartid, products : [{"product": productId, "quantity":quantity}] });
        
          writeJSONFile(cartsPath, carts);

          res.setHeader('Content-Type','application/json');
          res.status(201).json(cart);
    });
   
export default router;
