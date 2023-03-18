import * as fs from "fs";
import Fs from "fs/promises";

class ProductManager {
  constructor() {
    this.path = "./files/Productos.json";
  }

  writeFile = async (data) => {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2));
    } catch (err) {
      console.log(`error: ${err}`);
    }
  };

  getAll = async () => {
    /*Chequeo el tamaño del archivo .json*/

    async function fileSize(path) {
      const stats = await Fs.stat(path);

      return stats.size;
    }
    const sizeInBytes = await fileSize("./files/Productos.json");
    console.log(sizeInBytes);
    /*Si es igual a cero inserto un array vacío */
    if (sizeInBytes === 0) {
      this.writeFile([]);
    }
    try {
      const productos = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(productos);
    } catch (err) {
      if (err.message.includes("no such file or directory")) return [];
      console.log(`error: ${err}`);
    }
  };

  addProduct = async (req, res, obj) => {
    let productos = [];
    productos = await this.getAll();
  req.status = true;
  const product = req.body;
if(req.body.id) { res.send({ error: "El id es autogenerado" })}
if(!product.title) { res.send({ error: "El título del producto es obligatorio" })}
if(!product.description) { res.send({ error: "La descripción del producto es obligatoria" })}
if(!product.code) { res.send({ error: "El código del producto es obligatorio" })}
if(!product.price) { res.send({ error: "El precio del producto es obligatorio" })}
if(!product.status) { res.send({ error: "El status del producto es obligatorio" })}
if(!product.category) { res.send({ error: "La categoría del producto es obligatoria" })}
if(req.body.id) { res.send({ error: "El id es autogenerado" })}
if(req.body.id) { res.send({ error: "El id es autogenerado" })}
  // si no hay productos genera un id = 1, sino es autoincrementable
  productos.some((e) => e.id === 1)
    ? (product.id = Math.max(...productos.map((o) => o.id)) + 1)
    : (product.id = 1);
  if (productos.some((e) => e.id === product.id)) {
    return res.send({ error: "Producto con id duplicado" });
  }
  if (productos.some((e) => e.code === product.code)) {
    return res.send({ error: "El código no puede estar duplicado" });
  }
    try {
      let newId;
      productos.length === 0
        ? (newId = 1)
        : (newId = productos[productos.length - 1].id + 1);
      let newObj = { ...obj, id: newId };
      productos.push(newObj);
      await this.writeFile(productos);
      return newObj.id;
    } catch (err) {
      console.log(`error: ${err}`);
    }
  };

  getByIdParams = async (req, res) => {
    try {
  const productos = await this.getAll();
  const idProducto = Number(req.params.pid);
  const producto = productos.find((p) => p.id === idProducto);
  if (!producto) return res.send({ error: "Producto no encontrado" });
  res.send(producto);} catch (err) {
    console.log(`error: ${err}`);
  }
  };

  getById = async (id) => {
    try {
  const productos = await this.getAll();
  const producto = productos.find((p) => p.id === id);
  if (!producto) return res.send({ error: "Producto no encontrado" });
  res.send(producto);} catch (err) {
    console.log(`error: ${err}`);
  }
  };
  

  updateProduct = async (req, res) => {
    const productos = await this.getAll();

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
  await this.writeFile(productos);

  return res
    .status(200)
    .send({ status: "OK", message: "Product succesfully updated" });
  };

  deleteById = async (req, res) => {
  let productos = await this.getAll();
  const productId = req.params.pid;

  try {
  const productIndex = productos.findIndex((p) => p.id == productId);

  if (productIndex === -1) return res.status(404).json({});

  productos.splice(productIndex, 1);
  this.writeFile(productos);
  return res
  .status(200)
  .send({ status: "OK", message: "Product succesfully deleted" });
}

  catch (err) {
    console.log(`error: ${err}`);
  }
  };

  deleteAll = async () => {
    this.writeFile([]);
  };
}

export default ProductManager;
