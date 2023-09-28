import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import {cartModel} from './models/user.model.js';
import {productModel} from './models/user.model.js';
import {Router} from 'express';
import { body, validationResult } from 'express-validator';
import { ObjectId } from 'mongodb';

const router = Router ()

// Conectar a la base de datos MongoDB Atlas
mongoose.connect('mongodb+srv://omardagostino:laly9853@cluster0.x1lr5sc.mongodb.net/ecommerce1');

// Rutas para carritos

// GET para retornar un carrito por su ID
router.get('/carts/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
    if (!validObjectId) { 
      res.status(404).send("Identificador del carrito invalido");
      } else {
        const cart = await cartModel.findOne({ _id : cartId }).exec();
        if (cart) {
          res.json(cart);
        } else {
          res.status(404).send('Carrito no encontrado');
        }
      }
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
});

// POST para agregar un producto a un carrito existente
router.post('/carts/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = 1;

    const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
    if (!validObjectId) { 
      res.status(404).send("Identificador del carrito invalido");
      } else {

        const cart = await cartModel.findOne({ _id : cartId }).exec();

        if (!cart) {
          res.status(404).send('Carrito no encontrado');
          return;
        }

        // Añadir el producto al carrito

        const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
        if (!validObjectId) { 
          res.status(404).send("Identificador de Producto invalido");
          } else {
            const existingProduct = cart.products.find((p) => p.productId == productId);

            if (existingProduct) {
              existingProduct.quantity += quantity;
            } else {
                const product = await productModel.findOne({ _id: productId}).exec();
                if (product) {
                  cart.products.push({ productId, quantity })
                } else {
                  res.status(404).send('Producto no encontrado');
                  return;
                };
              }
            await cart.save();
            res.status(201).json(cart);
        }
      }
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
});

// POST para crear un nuevo carrito
router.post('/carts/product/:pid', async (req, res) => {
    try {
      const productId = req.params.pid;
      const quantity = 1;
  
      // Verificar si el producto existe en la base de datos de productos
      const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
      if (!validObjectId) { 
        res.status(404).send("Identificador de Producto invalido");
        } else {
      const product = await productModel.findOne({ _id : productId }).exec();
  
      if (!product) {
        res.status(404).send('Producto no encontrado');
        return;
      }
  
      const newCart = new cartModel({
        products: [{ productId, quantity }]
      });
     
      await newCart.save();
  
      res.status(201).json(newCart);
    }
    } catch (error) {
      res.status(500).send(`Error en el servidor ${error}`);
    }
  });

  // DELETE para eliminar un producto de un carrito 
router.delete('/carts/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
    if (!validObjectId) { 
      res.status(404).send("Identificador del carrito invalido");
      } else {

        const cart = await cartModel.findOne({ _id : cartId }).exec();

        if (!cart) {
          res.status(404).send('Carrito no encontrado');
          return;
        }

        const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;

        if (!validObjectId) { 
          res.status(404).send("Identificador de Producto invalido");
          } 
          else {
            const indice = cart.products.productId.indexOf(productId)
            if (indice!==-1) {
            cart.products.splice(indice,1)
            }
            else {
                  res.status(404).send('Producto no encontrado');
                  return;
            };
          }

            await cart.save();
            res.status(201).json(cart);
        }
      
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
});

 // DELETE para eliminar un producto de un carrito 
 router.delete('/carts/:cid', async (req, res) => {
    try {
      const cartId = req.params.cid;

      const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
      if (!validObjectId) { 
        res.status(404).send("Identificador del carrito invalido");
        } else {

          const cart = await cartModel.findOne({ _id : cartId }).exec();

          if (!cart) {
            res.status(404).send('Carrito no encontrado');
            return;
          } else {
            cart.products.length=0;
            await cart.save();
            res.status(201).json(cart);
          }

        }
      }
      catch (error) {
        res.status(500).send('Error en el servidor');
    }
  });

  // PUT para actualizar la cantidad de un producto de un carrito existente
router.put('/carts/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body;
    if (isNaN.quantity|| quantity<=0) {
      res.status(404).send('La cantidad debe ser un número positivo mayor que cero');
      return
    }
    const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
    if (!validObjectId) { 
      res.status(404).send("Identificador del carrito invalido");
      } else {        
        const cart = await cartModel.findOne({ _id : cartId }).exec();
        if (!cart) {
          res.status(404).send('Carrito no encontrado');
          return;
        }
        const indice = cart.products.productId.indexOf(productId)
            if (indice!==-1) {
              cart.products.quantity(indice)=quantity;
              await cart.save();
              res.status(201).json(cart);
            } else { 
              res.status(404).send('Producto no encontrado');
              return;                    
            };
      }
  }
   catch (error) {
    res.status(500).send('Error en el servidor');
  }
});


// PUT para actualizar todos los elementos de un carrito
router.put('/carts/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const nuevoCarrito = req.body;
    
    const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
    if (!validObjectId) { 
      res.status(404).send("Identificador del carrito invalido");
      return;
      }        
    const cart = await cartModel.findOne({ _id : cartId }).exec();
    if (!cart) {
          res.status(404).send('Carrito no encontrado');
          return;
      }
          
  if (Array.isArray(nuevoCarrito) && nuevoCarrito.length > 0) {
    
    const validacionExitosa = await Promise.all(
      nuevoCarrito.map(async (item) => {
        
        if (!ObjectId.isValid(item.productId)) {
          return false; 
        }

        const productExists = await Product.exists({ _id: item.productId });
        return productExists && typeof item.quantity === 'number' && item.quantity > 0;
      })
    );

    if (validacionExitosa.every((isValid) => isValid)) {
      cart.products=nuevoCarrito
      await cart.save();
      res.status(200).json({ mensaje: 'Carrito actualizado con éxito' });
    } else {
      res.status(400).json({ error: 'El contenido del carrito no es válido' });
    }
  } else {
    res.status(400).json({ error: 'El contenido del carrito esta vacio o no es valido' });
  }
      }
   catch (error) {
    res.status(500).send('Error en el servidor');
  }
});

// Rutas para productos

// validaciones de los datos de los productos nuevos

  const validateAddProduct = [
      body('title').notEmpty().isString(),
      body('description').notEmpty().isString(),
      body('code').notEmpty().isString(),
      body('price').notEmpty().isNumeric(),
      body('stock').notEmpty().isNumeric(),
      body('category').notEmpty().isString(),
      body('status').optional().isBoolean(),
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.setHeader('Content-Type','application/json');
          return res.status(400).json({ errors: errors.array() });
        }
        next();
      }
    ];

// Validaciones de las datos de los productos a actualizar
  
  const validateUpdateProduct = [
    body('title').optional().isString(),
    body('description').optional().isString(),
    body('code').optional().isString(),
    body('price').optional().isNumeric(),
    body('stock').optional().isNumeric(),
    body('category').optional().isString(),
    body('status').optional().isBoolean(),
     (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ];


// GET para retornar varios productos o todos
router.get('/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sortOrder = req.query.sort; 
    const query = req.query.query || ''; 
    const filter = {}; 
    if (req.query.code) {
      filter.code = req.query.code; 
    }
    if (req.query.stock) {
      filter.stock = req.query.stock; 
    }
     
    const options = {
      page,
      limit,
      sort: sortOrder ? { price: sortOrder === 'desc' ? -1 : 1 } : null,
    };
    const combinedFilter = {
      ...filter
    };

    const products = await productModel.paginate(combinedFilter, options);

    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < products.totalPages ? page + 1 : null;

    const response = {
      status: 'success',
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: prevPage ? `/products?page=${prevPage}&limit=${limit}&sort=${sortOrder}&query=${query}` : null,
      nextLink: nextPage ? `/products?page=${nextPage}&limit=${limit}&sort=${sortOrder}&query=${query}` : null,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error en el servidor',error });
    console.error(error)
  }
});

// GET para retornar un producto por su ID
router.get('/products/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
    if (!validObjectId) { 
      res.status(404).send("Identificador de Producto invalido");
      } else {
        const product = await productModel.findOne({ _id: productId}).exec();
        if (product) {
          res.json(product);
        } else {
          res.status(404).send('Producto no encontrado');
        }
      }
  } catch (error) {
    res.status(500).send(`Error en el servidor ${error}`);
  }
});

// POST para crear un nuevo producto
router.post('/products', validateAddProduct, async (req, res) => {
    try {
      const newProduct = req.body;
  
      // Verificar si el producto ya existe por su código
      const existingProduct = await productModel.findOne({ code: newProduct.code }).exec();
      if (existingProduct) {
        res.status(400).send('El producto con este código ya existe');
        return;
      }
  
      // Crea el nuevo producto con el productId actualizado
      const product = new productModel({ ...newProduct});
      await product.save();
  
      res.status(201).json(product);
    } catch (error) {
      res.status(500).send('Error en el servidor');
    }
  });
  

// PUT para actualizar un producto por su ID
router.put('/products/:pid', validateUpdateProduct, async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedProduct = req.body;
    const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
    if (!validObjectId) { 
      res.status(404).send("Identificador de Producto invalido");
      } else {


    const product = await productModel.findOne({ _id : productId }).exec();

    if (!product) {
      res.status(404).send('Producto no encontrado');
      return;
    }

    // Actualizar el producto
    for (const key in updatedProduct) {
      if (updatedProduct.hasOwnProperty(key)) {
        product[key] = updatedProduct[key];
      }
    }

    await product.save();

    res.status(200).json(product);
  }
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
});

// DELETE para eliminar un producto por su ID
router.delete('/products/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
    if (!validObjectId) { 
      res.status(404).send("Identificador de Producto invalido");
      } else {

    const product = await productModel.findOne({ _id : productId }).exec();

    if (!product) {
      res.status(404).send('Producto no encontrado');
      return;
    }

    await product.deleteOne({ _id : productId })
    res.status(200).send(`Producto con ID ${productId} eliminado`)
  }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error en el servidor')
  }
});

export default router;
