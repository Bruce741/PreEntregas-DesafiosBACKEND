import { Router } from "express";
import CartManager from "../cartManager.js";

const cartManager = new CartManager("src/cart.json");

const cartsRouter = Router();

// Obtener Carrito
cartsRouter.get("/", async (req, res) => {
  const carts = await cartManager.getCarts();
  res.send(carts);
});

// Obtener Carrito por ID
cartsRouter.get("/:cId", async (req, res) => {
  const { cId } = req.params;
  const cartById = await cartManager.getCartsById(cId);
  res.send(cartById);
});

// Añadir Carrito
cartsRouter.post("/", async (req, res) => {
  const cartAdded = await cartManager.addCart();
  if (!cartAdded) {
    return res.status(400).send({ message: "error: cart not added" });
  }
  res.send({ message: "Cart added" });
});

//Añadir producto al carrito
cartsRouter.post("/:cId/product/:pId", async (req, res) => {
  const { pId, cId } = req.params;
  const productAddedCart = await cartManager.addProductsCart(pId, cId);
  res.send({ message: "Product added" });
});

export default cartsRouter;
