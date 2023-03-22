import * as fs from "fs";
import Fs from "fs/promises";
import ProductManager from "./productManager.js";

class CartManager {
  constructor() {
    this.path = "./files/Carrito.json";
  }

  writeFile = async (data) => {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2));
    } catch (err) {
      console.log(`error: ${err}`);
    }
  };

  getAllCarts = async () => {
    /*Chequeo el tamaño del archivo .json*/

    async function fileSize(path) {
      const stats = await Fs.stat(path);

      return stats.size;
    }
    const sizeInBytes = await fileSize("./files/Carrito.json");
    console.log(sizeInBytes);
    /*Si es igual a cero inserto un array vacío */
    if (sizeInBytes == 0) {
      this.writeFile([]);
    }
    try {
      const carritos = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(carritos);
    } catch (err) {
      if (err.message.includes("no such file or directory")) return [];
      console.log(`error: ${err}`);
    }
  };

  addCart = async (req, res) => {

  let carts = [];
  carts = await this.getAllCarts();
  const cart = req.body;
  if (!req.body.id) {
    try {
    carts.some((e) => e.id === 1)
      ? (cart.id = Math.max(...carts.map((o) => o.id)) + 1)
      : (cart.id = 1);
    if (carts.some((e) => e.id === cart.id)) {
      console.log("Error: Carrito con id duplicado");
    return null;
    }
    carts.push(cart);
    await this.writeFile(carts);
    return cart.id;
  } catch (err) {
    console.log(`error: ${err}`);
  }
  } else {
    console.log("Error: El id es autogenerado");
    return null;
  } 
  };

  getById = async (id) => { 
    try {
      let carts = await this.getAllCarts();
      const obj = carts.find((id) => carts.id === id);
      return obj ? obj : null;
    } catch (err) {
      console.log(`error: ${err}`);
    }
  };

  updateCart = async (req, res) => {
    try {
    let carts = []
    carts = await this.getAllCarts();

  const cartId = Number(req.params.cid);
  const productId = Number(req.params.pid);
  // const product = await ProductManager.getById(productId);

  const cartFound = carts.find((c) => c.id === cartId);
  if (cartFound === -1) {
    console.log("Cart not found");
    return null;
  }
  const productInCart = cartFound.productos.find((p) => p.producto == productId);

  /** Encuentra el producto ya existente? */
  if (productInCart) {
    const pIndex = cartFound.productos.findIndex((p) => p.producto == productId);
    cartFound.productos[pIndex].quantity =
      cartFound.productos[pIndex].quantity + 1;
  } else {
    let productoApushear = {
      "producto": productId,
      "quantity": 1
    }
    cartFound.productos.push(productoApushear);
  }


  const cartIndex = carts.findIndex((c) => c.id == cartId);
  const cart = carts[cartIndex];

  const updatedCart = {
    ...cartFound,
  };

  carts.splice(cartIndex, 1, updatedCart);
  await this.writeFile(carts);
  console.log("Cart succesfully updated");
    return updatedCart;
  } catch (err) {
    console.log(`error: ${err}`);
  }
};

}

export default CartManager;
