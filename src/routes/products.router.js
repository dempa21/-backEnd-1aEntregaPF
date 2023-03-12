import { Router } from "express";
import { uploader } from "../utils.js";
const router = Router();
import * as fs from "fs";
import ProductManager from "../productManager.js";

const productManager = new ProductManager();

router.get("/", async (req, res) => {
  const productos = await productManager.getAll();

  const { query, limit } = req.query;
  let productsFiltrados = [...productos];

  if (limit) {
    productsFiltrados = productsFiltrados.slice(0, Number(limit));
  }

  res.json(productsFiltrados);
});

router.get("/:pid", async function (req, res) {
  const productos = await productManager.getAll();
  const idProducto = Number(req.params.pid);
  const producto = productos.find((p) => p.id === idProducto);
  if (!producto) return res.send({ error: "Producto no encontrado" });
  res.send(producto);
});

router.post("/", async (req, res) => {
  const productos = await productManager.getAll();
  req.status = true;
  const product = req.body;
  req.body.id
    ? res.send({ error: "El id es autogenerado" })
    : product.title
    ? product.title
    : res.send({ error: "El título del producto es obligatorio" });
  product.description
    ? product.description
    : res.send({ error: "La descripción del producto es obligatoria" });
  product.code
    ? product.code
    : res.send({ error: "El código del producto es obligatorio" });
  product.price
    ? product.price
    : res.send({ error: "El precio del producto es obligatorio" });
  product.status
    ? product.status
    : res.send({ error: "El status del producto es obligatorio" });
  product.stock
    ? product.stock
    : res.send({ error: "El stock del producto es obligatorio" });
  product.category
    ? product.category
    : res.send({ error: "La categoría del producto es obligatoria" });
  // si no hay productos genera un id = 1, sino es autoincrementable
  productos.some((e) => e.id === 1)
    ? (product.id = Math.max(...productos.map((o) => o.id)) + 1)
    : (product.id = 1);
  if (productos.some((e) => e.id === product.id)) {
    return res.send({ error: "Producto con id duplicado" });
  }
  productos.push(product);
  productManager.writeFile(productos);
  return res.send({ status: "Success" });
});

router.put("/:pid", async function (req, res) {
  const productos = await productManager.getAll();

  const productId = req.params.pid;
  const changes = req.body;

  const productIndex = productos.findIndex((p) => p.id == productId);

  if (productIndex === -1) {
    return res
      .status(404)
      .send({ status: "Error", message: "Producto not found" });
  }

  if (changes.id) {
    return res
      .status(400)
      .send({ status: "Error", message: "Cannot update product id" });
  }

  const product = productos[productIndex];

  const updatedProduct = {
    ...product,
    ...changes,
  };

  productos.splice(productIndex, 1, updatedProduct);
  productManager.writeFile(productos);

  return res
    .status(200)
    .send({ status: "OK", message: "Product succesfully updated" });
});

router.delete("/:pid", async (req, res) => {
  const productos = await productManager.getAll();
  const productId = req.params.pid;

  const productIndex = productos.findIndex((p) => p.id == productId);

  if (productIndex === -1) return res.status(404).json({});

  productos.splice(productIndex, 1);
  productManager.writeFile(productos);
  //   await fs.promises.writeFile(
  //     './files/Productos.json', JSON.stringify(productos, null, 2)
  // )
  return res
    .status(200)
    .send({ status: "OK", message: "Product succesfully deleted" });
});

export default router;
