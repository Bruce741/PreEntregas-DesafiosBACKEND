import { Router } from "express";
import CartManager from "../dao/managerFS/cartManager.js";
import { cartsModel } from "../dao/models/carts.models.js";

const cartManager = new CartManager("src/cart.json");

const cartsRoutes = Router();

// Obtener Carritos
cartsRoutes.get("/", async (req, res) => {
  const carts = await cartsModel.find();
  res.send({ carts });
});

// Obtener Carrito por ID
cartsRoutes.get("/:cId", async (req, res) => {
  const { cId } = req.params;
  const cartById = await cartsModel.findOne({ _id: cId }).populate('products.product');
  res.send(cartById);
});

// Crear Carrito
cartsRoutes.post("/", async (req, res) => {
  const newCart = [];
  const cartAdded = await cartsModel.create(newCart);
  if (!cartAdded) {
    return res.status(400).send({ message: "error: cart not added" });
  }
  res.send({ message: "Cart added" });
});

//Añadir producto al carrito
cartsRoutes.post("/:cId/product/:pId", async (req, res) => {
  try {
    const { pId, cId } = req.params;
    await cartsModel.insertOne();
    res.send({ message: "Product added" });
  } catch (error) {
    
  }
});

//Actualizar carrito
cartsRoutes.put("/:cId", async (req, res) => {
  try {
    const { cId } = req.params;
    const { products } = req.body;
    const result = await cartsModel.updateOne(
      { _id: cId },
      { products: products }
    );
    res.send({ message: "Cart updated", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cart Not Updated" });
  }
});

//Borrar carrito
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

// Borrar todos los productos del carrito
cartsRoutes.delete("/:cId/", async (req, res) => {
  try {
    const { cId } = req.params;

    if (!cId) {
      return res.status(400).json({ message: "Missing ID" });
    }

    const existingCart = await cartsModel.uptadeOne({ _id: cId }, {
      products: []
    });
    if (!existingCart) {
      return res.status(404).json({ message: "Cart Not Found" });
    }
    res.json({ message: "Cart Emptied" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cart Not Emptied" });
  }
});

//Borrar un producto de un carrito
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
