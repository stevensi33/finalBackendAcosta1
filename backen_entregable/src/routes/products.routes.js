import { Router } from 'express';
import ProductManager from "../scripts/ProductManager.js";
const router = Router();


// Proporciona la ruta al archivo JSON al instanciar ProductManager
const productManager = new ProductManager('./src/files/products.json');

// Ruta GET para obtener todos los productos
router.get("/", async (req, res) => {
  try {
    // Obtiene todos los productos usando el método getProducts
    const products = await productManager.getProducts();
    res.status(200).send(products);
  } catch (error) {
    // Captura cualquier error que ocurra durante la recuperación de los productos
    res.status(500).send({ error: error.message });
  }
});

// Ruta POST para agregar un nuevo producto
router.post("/", async (req, res) => {
  try {
    const { title, price, code, stock, description, status, thumb } = req.body;
    console.log(title, price, code, stock, description, status, thumb);
    // Agrega un nuevo producto utilizando el método addProduct de ProductManager
    const newProduct = await productManager.addProduct({
      title,
      price,
      code,
      stock,
      description,
      status,
      thumb
    });
    res.status(201).send(newProduct);
  } catch (error) {
    // Captura cualquier error que ocurra durante el proceso de adición del producto
    res.status(500).send({ error: error.message });
  }
});

// Buscar productos por id
router.get("/:id", async (req, res) => {
  res.send(await productManager.getProductById(parseInt(req.params.id)));
});

// Eliminar productos por id
router.delete("/:id", async (req, res) => {
  res.send(await productManager.deleteProduct(parseInt(req.params.id)));
});


// Actualizar productos por id
// Ruta PUT para actualizar un producto por ID
router.put("/:id", async (req, res) => {
  try {
    const updates = req.body; // Toma todas las actualizaciones del cuerpo de la solicitud
    const id = parseInt(req.params.id); // Convierte el ID de la ruta a un entero
    const updatedProduct = await productManager.updateProductById(id, updates); // Llama al método de actualización

    if (updatedProduct) {
      res.status(200).send(updatedProduct);
    } else {
      res.status(404).send({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});



export default router 