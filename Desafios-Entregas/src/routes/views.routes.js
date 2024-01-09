import { Router } from "express";
import ProductManager from "../productManager.js";

const viewsRouter = Router();
const productManager = new ProductManager("./src/productos.json");

viewsRouter.get("/", async (req, res) => {
    try {
      const products = await productManager.getProducts();
      res.render("index", { products }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener los productos" });
    }
  });

export default viewsRouter;