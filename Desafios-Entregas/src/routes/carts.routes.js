import { Router } from "express";
import CartManager from "../dao/managerFS/cartManager.js";
import { cartsModel } from "../dao/models/carts.models.js";

const cartManager = new CartManager("src/cart.json");

const cartsRoutes = Router();

// Obtener Carrito
cartsRoutes.get("/", async (req, res) => {
  const carts = await cartsModel.find();
  res.send({carts});
});

// Obtener Carrito por ID
cartsRoutes.get("/:cId", async (req, res) => {
  const { cId } = req.params;
  const cartById = await cartsModel.findOne({_id: cId});
  res.send(cartById);
});

// Añadir Carrito
cartsRoutes.post("/", async (req, res) => {
  const newCart = []
  const cartAdded = await cartsModel.create(newCart);
  if (!cartAdded) {
    return res.status(400).send({ message: "error: cart not added" });
  }
  res.send({ message: "Cart added" });
});

//Añadir producto al carrito
cartsRoutes.post("/:cId/product/:pId", async (req, res) => {
  const { pId, cId } = req.params;
  await cartsModel.insertOne()
  res.send({ message: "Product added" });
});

//Actualizar carrito
cartsRoutes.put('/:cId', async (req, res) => {
  const { cId } = req.params;
  const cart = req.body;
  const result = await cartsModel.updateOne({_id: cId}, cart);
  res.send({message: 'Cart updated'}, result);
});

//Borrar carrito 
cartsRoutes.delete("/:cid/", async (req, res) => {
  try {
    const { cid } = req.params;
    
    if (!cid) {
      return res.status(400).json({ message: "Missing ID" });
    }

    const existingCart = await cartsModel.findOne({_id: pid});
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

//Borrar un producto de un carrito
cartsRoutes.post("/:cId/product/:pId", async (req, res) => {
  const { pId, cId } = req.params;
  const result = await cartsModel.updateOne({_id: cId}, {
    $pull: {products: {product : new mongoose.Types.ObjectId(pId)}}
  });
  res.send({ message: "Product deleted" });
});

export default cartsRoutes;
