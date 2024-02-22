import { Router } from 'express';
import ProductManager from '../Products/productManager.js';

const router = Router();


// Proporciona la ruta al archivo JSON al instanciar ProductManager
const productManager = new ProductManager('./src/data/products.json');

// Ruta GET para obtener todos los productos
router.get("/", async (req, res) => {
    const productList = await productManager.getProducts();
    res.render('home', { style: "/css/index.css", productList })
})


router.get('/realtimeproducts', async (req, res) => {
    res.render('realtimeproduct', { style: "/css/index.css" })
})



export default router