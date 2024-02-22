import express from 'express';
import productRouters from "./routes/products.routes.js"
import cartRoutes from "./routes/cart.routes.js";

const app = express();

// Esto es un Mideldware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const PORT = 8080;

// Ruta Telemetria
app.get('/ping', (req, res) => {
    res.send({ status: "ok" })
})

// puntos de entrada para ROUTERS
app.use('/api/product', productRouters)
app.use('/api/cart', cartRoutes)

// Puerto
app.listen(PORT, () => {
    console.log(`Server run on port ${PORT}`);
})

