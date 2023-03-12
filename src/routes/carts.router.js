import { Router } from "express";
const router = Router();
import * as fs from 'fs';
import CartManager from "../cartManager.js";

let carts = [];
const cartManager = new CartManager();

router.get('/', async (req,res) => {
    const carts = await cartManager.getAllCarts();
    // const cartsA = await fs.promises.readFile('./files/Carrito.json', 'utf-8');
    // const carts = JSON.parse(cartsA);
    const {query, limit} = req.query;
    res.json(carts);
  });

router.post("/", async (req, res) => {
    const carts = await cartManager.getAllCarts();
    console.log(carts);
    const cart = req.body;
    if(req.body.id) {return res.send({ error: "El id es autogenerado" })} else {
    carts.some(e => e.id === 1) ? cart.id = Math.max(...carts.map(o => o.id)) + 1 : cart.id = 1;
    if (carts.some(e => e.id === cart.id)) { return res.send({ error: "Carrito con id duplicado" });}
    console.log(cart);
    carts.push(cart);
    console.log(carts);
    await cartManager.writeFile(carts);
    // await fs.promises.writeFile(
    //     './files/Carrito.json', JSON.stringify(carts, null, 2)
    // )
      return res.send({ status: "Success" });
    } 
  });

  router.get("/:cid", async function(req, res) {

    const carts = await cartManager.getAllCarts();
    const idCart = Number(req.params.cid);
    const cart = carts.find((c) => c.id === idCart);
    if (!cart) return res.send({ error: "Carrito no encontrado" });
    res.send(cart);
  });

  router.post("/:cid/product/:pid", async (req, res) => {
    const carts = await cartManager.getAllCarts();
    const idCart = Number(req.params.cid);
    const idProduct = Number(req.params.pid);
    const prod = req.body;

    const cartFound = carts.find((c) => c.id === idCart);
    console.log(cartFound);
    console.log(idProduct);
    console.log(cartFound.productos.find((car) => car.id == idProduct));

    if(cartFound.productos.find((car) => car.id == idProduct)) {
      const cIndex = cartFound.productos.findIndex((c) => c.id === idProduct);
      cartFound.productos[cIndex].qty = cartFound.productos[cIndex].qty + prod.qty;
    } else {  cartFound.productos.push(prod);}

  

    const cartIndex = carts.findIndex((c) => c.id == idCart);
    carts.splice(cartIndex, 1, cartFound);
    await cartManager.writeFile(carts);
      return res.send({ status: "Success" });
    
  });
  export default router;