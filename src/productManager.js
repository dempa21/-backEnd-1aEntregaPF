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
    if (sizeInBytes == 0) {
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

  save = async (obj) => {
    let productos = this.getAll();
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

  getById = async (id) => {
    let productos = await this.getAll();
    try {
      const obj = productos.find((id) => productos.id === id);
      return obj ? obj : null;
    } catch (err) {
      console.log(`error: ${err}`);
    }
  };

  deleteById = async (id) => {
    let productos = await this.getAll();
    try {
      productos = productos.filter((producto) => producto.id != id);
      await this.writeFile(productos);
    } catch (err) {
      console.log(`error: ${err}`);
    }
  };

  deleteAll = async () => {
    this.writeFile([]);
  };
}

export default ProductManager;
