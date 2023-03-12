import * as fs from "fs";
import Fs from "fs/promises";

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
}

export default CartManager;
