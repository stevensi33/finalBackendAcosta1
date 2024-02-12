import fs from 'fs';

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.lastId = 0;
    }

    async init() {
        try {
            if (!fs.existsSync(this.path)) {
                await fs.promises.writeFile(this.path, JSON.stringify([]));
            } else {
                let data = await fs.promises.readFile(this.path, 'utf-8');
                this.products = JSON.parse(data);
                this.lastId = this.products.length > 0 ? this.products[this.products.length - 1].id : 0;
            }
        } catch (error) {
            console.error(`Error initializing ProductManager: ${error}`);
            throw error;
        }
    }

    async addProduct(product) {
        try {
          const existingProducts = await this.getProducts(); // lee primero los productos existentes          
          // Obtiene el último id de los productos existentes
          const lastId = existingProducts.length > 0 ? existingProducts[existingProducts.length - 1].id : 0;
          // Incrementar lastId según el valor del archivo
          this.lastId = lastId + 1;      
          // Crea el nuevo producto con el ID correcto
          const newProduct = { ...product, id: this.lastId };      
          // Añadir el nuevo producto a la lista
          existingProducts.push(newProduct);      
          // vuelve a escribir el archivo JSON
          await fs.promises.writeFile(this.path, JSON.stringify(existingProducts, null, 2));      
          return newProduct;
        } catch (error) {
          console.error(`Error adding product: ${error}`);
          throw error;
        }
      }
      

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);            
        } catch (error) {
            console.error(`Error getting products: ${error}`);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts();
            const product = products.find(product => product.id === id);
            if (product) {
                console.log('ID del producto encontrado:', product.id); // Imprime solo el ID
            } else {
                console.log('Producto con ID:', id, 'no encontrado');
            }
            return product;
        } catch (error) {
            console.error(`Error getting product by id: ${error}`);
            throw error;
        }
    }
    
      
    //Actualizar registros 

    async updateProduct(id, property, newValue) {
        try {
          // Lectura única de productos
          const products = await this.getProducts();
          const productIndex = products.findIndex(product => product.id === id);
          if (productIndex !== -1) {
            products[productIndex][property] = newValue;
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
            
            return `El producto con id ${id} fue modificado con éxito.`;
          } else {
            throw new Error('Error inesperado: El producto no se encuentra en la lista.');
          }
        } catch (error) {
          console.error(`Error al tratar de modificar el producto. Detalle del error: ${error}`);
          throw error;
        }
      }
      
    
    
    
    async deleteProduct(id) {
        try {
            const products = await this.getProducts(); // Obtiene los productos actuales
            const largoInicial = products.length; // Longitud antes de filtrar
            const productosRestantes = products.filter(product => product.id !== id); // Filtra por ID
            const diferencia = largoInicial > productosRestantes.length; // Verifica si se eliminó algún producto
            
            await fs.promises.writeFile(this.path, JSON.stringify(productosRestantes, null, 2)); // Actualiza el archivo
            
            return diferencia; // Retorna true si se eliminó un producto, false en caso contrario
        } catch (error) {
            console.error(`Error deleting product: ${error}`);
            throw error;
        }
    }


    async updateProductById(id, updates) {
        try {
            const products = await this.getProducts();
            const productIndex = products.findIndex(product => product.id === id);
            if (productIndex === -1) {
                throw new Error('Producto no encontrado');
            }
            // Actualiza las propiedades del producto encontrado con los valores proporcionados en `updates`
            products[productIndex] = { ...products[productIndex], ...updates };
            // Guarda la lista actualizada de productos en el archivo
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
            return products[productIndex];
        } catch (error) {
            console.error(`Error updating product by id: ${error}`);
            throw error;
        }
    }
    
    
}



export default ProductManager;

