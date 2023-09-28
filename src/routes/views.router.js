import express from 'express';
import { getProducts } from './products.routes.js';

const router = express.Router ();

router.get('/',(req,res)=>
{
    res.render('index', {})
});

router.get('/realtimeproducts', (req, res) => {
    const products = getProducts(); 
    res.render('realTimeProducts', { products });
  });

// Get para la vista home de Handlebars

router.get('/home', (req, res) => {
  const products = getProducts();
  res.render('home', { products });
});


export default router;