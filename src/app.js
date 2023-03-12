import express from "express";
import ProductManager from "./productManager.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import __dirname from "./utils.js";
import * as fs from 'fs';

/**
 * Ya tenemos express instalado, sin embargo, antes de poder usarlo tenemos que inicializarlo.
 *
 * A partir de la linea de abajo, nuestra variable "app" tendrá todas las funcionalidades
 * que nos ofrece express.
 */
const app = express();


  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(`${__dirname}/public`));

  app.use("/api/products", productsRouter);
  app.use("/api/carts", cartsRouter);
  

app.listen(8080, () => {
  console.log("Servidor arriba en el puerto 8080");
});
