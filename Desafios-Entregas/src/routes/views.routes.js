import { Router } from "express";
import ProductManager from "../dao/managerFS/productManager.js";
import { productsModel } from "../dao/models/products.models.js";

const viewsRouter = Router();
const productManager = new ProductManager("./src/productos.json");

viewsRouter.get("/", async (req, res) => {
  try {
    const products = await productsModel.find();
    return res.render("index", { products: products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener los productos" });
  }
});

viewsRouter.get('/products', async (req, res)=>{
  const {page} = req.query;
  const products = await productsModel.find(10, page);
  res.render('products', products)
})

export default viewsRouter;
