import { Router } from "express";
import CartManager from "../dao/managerFS/cartManager.js";
import { cartsModel } from "../dao/models/carts.models.js";
import { productsModel } from "../dao/models/products.models.js";

const cartManager = new CartManager("src/cart.json");

const cartsRoutes = Router();

// Obtener Carritos // 
cartsRoutes.get("/", async (req, res) => {
  const carts = await cartsModel.find();
  return res.send({ carts });
});

// Obtener Carrito por ID 
cartsRoutes.get("/:cId", async (req, res) => {
  try {
    const { cId } = req.params;
    const cartById = await cartsModel.findOne({ _id: cId }).populate("productos.product");
    return res.send(cartById); 
  } catch (error) {
    return res.status(400).send({ message: "Error: cart not found" });
  }
});

// Crear Carrito //
cartsRoutes.post("/", async (req, res) => {
  try {
    const cartData = req.body;
    const cartAdded = await cartsModel.create({ cartData });
    res.send({ message: "Cart added" });
  } catch (error) {
    return res.status(500).send({ message: "error: cart not added" });
  }
});

//Añadir producto al carrito X
cartsRoutes.post("/:cId/product/:pId", async (req, res) => {
  try {
    const { pId, cId } = req.params;

    const productoAgregado = productsModel.findOne({ _id: pId })
    console.log(productoAgregado.products.length)

    await cartsModel.findOne({ _id: cId }).insertOne(productoAgregado);

    res.send({ message: "Product added to cart" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error: Product not added" });
  }
});

//Actualizar carrito // 
cartsRoutes.put("/:cId", async (req, res) => {
  try {
    const { cId } = req.params;
    const { products } = req.body;
    const result = await cartsModel.updateOne(
      { _id: cId },
      { productos: products }
    );
    res.send({ message: "Cart updated", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cart Not Updated" });
  }
});

//Borrar carrito // 
cartsRoutes.delete("/:cId/", async (req, res) => {
  try {
    const { cId } = req.params;

    if (!cId) {
      return res.status(400).json({ message: "Missing ID" });
    }

    const existingCart = await cartsModel.findOne({ _id: cId });
    if (!existingCart) {
      return res.status(404).json({ message: "Cart Not Found" });
    }

    await cartsModel.deleteOne(existingCart);

    res.json({ message: "Cart Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cart Not Deleted" });
  }
});

// Borrar todos los productos del carrito // 
cartsRoutes.delete("/:cId/", async (req, res) => {
  try {
    const { cId } = req.params;

    if (!cId) {
      return res.status(400).json({ message: "Missing ID" });
    }

    const existingCart = await cartsModel.uptadeOne(
      { _id: cId },
      {
        products: [],
      }
    );
    if (!existingCart) {
      return res.status(404).json({ message: "Cart Not Found" });
    }
    res.json({ message: "Cart Emptied" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cart Not Emptied" });
  }
});

//Borrar un producto de un carrito // 
cartsRoutes.post("/:cId/product/:pId", async (req, res) => {
  const { pId, cId } = req.params;
  const result = await cartsModel.updateOne(
    { _id: cId },
    {
      $pull: { products: { product: new mongoose.Types.ObjectId(pId) } },
    }
  );
  if (result.modifiedCount > 0) {
    res.send({ message: "Product deleted" });
  } else {
    res.status(404).send({ message: "Product not found" });
  }
});

export default cartsRoutes;
