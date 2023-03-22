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

if(product.title && product.description && product.code && product.price && product.status && product.category && !req.body.id) {
  // si no hay productos genera un id = 1, sino es autoincrementable
  productos.some((e) => e.id === 1)
    ? (product.id = Math.max(...productos.map((o) => o.id)) + 1)
    : (product.id = 1);
  if (productos.some((e) => e.id === product.id)) {
    console.log("Producto con id duplicado");
    return null;
  }
  if (productos.some((e) => e.code === product.code)) {
    console.log("El código no puede estar duplicado");
    return null;
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
    }} else {
      console.log("Los campos son obligatorios y el ID es autogenerado");
        return null;
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
  
  if (!producto) { 
  console.log("Producto no encontrado");
  return null;}
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
    console.log("Producto not found");
        return null;
  }

  if (changes.id) {
    console.log("Cannot update product id");
        return null;
  }

  const product = productos[productIndex];

  const updatedProduct = {
    ...product,
    ...changes,
  };

  productos.splice(productIndex, 1, updatedProduct);
  await this.writeFile(productos);
  console.log("Product succesfully updated");
  res.send(productos);
  };

  deleteById = async (req, res) => {
  let productos = await this.getAll();
  const productId = req.params.pid;

  try {
  const productIndex = productos.findIndex((p) => p.id == productId);

  if (productIndex === -1) {return 
  console.log("404");
  return null;}

  productos.splice(productIndex, 1);
  this.writeFile(productos);
  console.log("Product succesfully deleted");
  res.send(productos);
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
