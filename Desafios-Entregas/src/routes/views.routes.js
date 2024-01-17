import { Router } from "express";
import ProductManager from "../productManager.js";

const viewsRouter = Router();
const productManager = new ProductManager("./src/productos.json");

viewsRouter.get("/", async (req, res) => {
    try {
      const products = await productManager.getProducts();
      return res.render('index', {products: products});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al obtener los productos" });
    }
  });

export default viewsRouter;