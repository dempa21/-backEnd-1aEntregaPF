import { Router } from "express";
import { uploader } from "../utils.js";
const router = Router();
import * as fs from "fs";
import ProductManager from "../productManager.js";

const productManager = new ProductManager();

router.get("/", async (req, res) => {
  const productos = await productManager.getAll();

  const { limit } = req.query;
  let productsFiltrados = productos;

  if (limit) {
    productsFiltrados = productsFiltrados.slice(0, Number(limit));
  }

  res.json(productsFiltrados);
});

router.get("/:pid", async function (req, res) {
  await productManager.getByIdParams(req, res);

});

router.post("/", async (req, res) => {
  const product = req.body;
  await productManager.addProduct(req, res, product);
  return res.send({ status: "Success" });
});

router.put("/:pid", async function (req, res) {
  await productManager.updateProduct(req, res);
});

router.delete("/:pid", async (req, res) => {
  await productManager.deleteById(req, res);
});

export default router;
