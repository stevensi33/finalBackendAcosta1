import { Router } from 'express';
import CartManager from "../scripts/CartManager.js";

const router = Router();
const cartManager = new CartManager('./src/files/carts.json');

// Inicializar CartManager
cartManager.init();

// Ruta POST para crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const cartId = await cartManager.createCart();
    res.status(201).send({ cartId });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Ruta GET para listar productos de un carrito específico
router.get("/:cid", async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const products = await cartManager.getCartById(cid);
    if (products !== null) {
      res.status(200).send(products);
    } else {
      res.status(404).send({ error: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Ruta POST para agregar un producto a un carrito
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    const cart = await cartManager.addProductToCart(cid, pid);
    res.status(200).send(cart);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;
