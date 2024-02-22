import fs from 'fs';

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.lastId = 0;
    }

    async init() {
        try {
            if (!fs.existsSync(this.path)) {
                await fs.promises.writeFile(this.path, JSON.stringify([]));
            } else {
                let data = await fs.promises.readFile(this.path, 'utf-8');
                this.carts = JSON.parse(data);
                this.lastId = this.carts.length > 0 ? this.carts[this.carts.length - 1].id : 0;
            }
        } catch (error) {
            console.error(`Error initializing CartManager: ${error}`);
            throw error;
        }
    }

    async createCart() {
        try {
            this.lastId++;
            const newCart = { id: this.lastId, products: [] };
            this.carts.push(newCart);
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
            return newCart.id;
        } catch (error) {
            console.error(`Error creating cart: ${error}`);
            throw error;
        }
    }

    async getCartById(cid) {
        try {
            const cart = this.carts.find(cart => cart.id === cid);
            return cart ? cart.products : null;
        } catch (error) {
            console.error(`Error getting cart by id: ${error}`);
            throw error;
        }
    }

    async addProductToCart(cid, pid) {
        try {
            const cartIndex = this.carts.findIndex(cart => cart.id === cid);
            if (cartIndex === -1) {
                throw new Error('Cart not found');
            }
            const productIndex = this.carts[cartIndex].products.findIndex(product => product.product === pid);
            if (productIndex !== -1) {
                this.carts[cartIndex].products[productIndex].quantity += 1;
            } else {
                this.carts[cartIndex].products.push({ product: pid, quantity: 1 });
            }
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
            return this.carts[cartIndex];
        } catch (error) {
            console.error(`Error adding product to cart: ${error}`);
            throw error;
        }
    }
}


export default CartManager;