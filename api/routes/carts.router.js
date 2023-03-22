import { Router } from "express";
const router = Router();
import * as fs from "fs";
import CartManager from "../cartManager.js";

let carts = [];
const cartManager = new CartManager();

router.get("/", async (req, res) => {
  const carts = await cartManager.getAllCarts();
  res.json(carts);
});

router.post("/", async (req, res) => {
  await cartManager.addCart(req, res);
  res.redirect('/api/carts');  
  });
 

router.get("/:cid", async function (req, res) {
  const carts = await cartManager.getAllCarts();
  const idCart = Number(req.params.cid);
  const cart = carts.find((c) => c.id === idCart);
  if (!cart) return res.send({ error: "Carrito no encontrado" });
  res.send(cart);


});

router.post("/:cid/product/:pid", async (req, res) => {
await cartManager.updateCart(req, res);
});
export default router;
