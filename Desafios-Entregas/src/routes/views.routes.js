import { Router } from "express";
import { productsModel } from "../dao/models/products.models.js";
import { cartsModel } from "../dao/models/carts.models.js";

const viewsRouter = Router();

// Vista default?
viewsRouter.get("/", async (req, res) => {
  try {
    const products = await productsModel.find().lean();
    return res.render("index", {products});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener los productos" });
  }
});

// Vista para añadir productos //
viewsRouter.get("/add-products", (req,res) => {
  res.render('add-products');
});

// Vista de los productos // (Falta poder añadir productos a carrito)
viewsRouter.get("/products", async (req,res) => {
  const {limit = 10, page = 1, query = "", sort = ""} = req.query;
  const [code,value] = query.split(":");
  const products = await productsModel.paginate({[code]: value}, {
    limit,
    page,
    sort: sort ? {precio: sort} : {}
  });
  products.payload = products.docs;
  delete products.docs;
  res.render('products', products)
});

// Vista del carro // 
viewsRouter.get("/carts/:cId", async (req, res) => {
  try {
    const { cId } = req.params;
    const cart = await cartsModel.findOne({ _id: cId }).populate("productos.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart Not Found" });
    }

    res.render("cart", { cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching cart details" });
  }
}); 

export default viewsRouter;
