import { Router } from "express";
import CartManager from "../dao/managerFS/cartManager.js";
import { cartsModel } from "../dao/models/carts.models.js";
import { productsModel } from "../dao/models/products.models.js";
import mongoose from "mongoose";

const cartManager = new CartManager("src/cart.json");

const cartsRoutes = Router();

// Obtener Carritos //
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
    const { cId } = req.params;
    const cartById = await cartsModel
      .findOne({ _id: cId })
      .populate("productos.product");
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

//Añadir producto al carrito //
cartsRoutes.post("/:cId/product/:pId", async (_req_, _res_) => {
  const { pId, cId } = _req_.params;

  const { quantity } = _req_.body;

  if (!quantity) {
    return _res_.status(400).send({ message: "Quantity is required" });
  }

  try {
    const cart = await cartsModel.findOne({ _id: cId });

    //Verifico si el carrito existe

    if (!cart) {
      return _res_.status(404).send({ message: "Cart not found" });
    }

    // Verificar si el producto existe en la base de datos de productos y tiene suficiente stock

    const product = await productsModel.findOne({ _id: pId });

    if (!product) {
      return _res_.status(404).send({ message: "Product not found" });
    }

    // Verificar si el producto tiene el stock necesario segun el pedido

    if (product.stock <= quantity) {
      return _res_.status(400).send({ message: "Not enough stock available" });
    }

    // Buscar el producto en el carrito

    const productIndex = cart.productos.findIndex(
      (_p_) => _p_.product && _p_.product.toString() === pId
    );

    if (productIndex !== -1) {
      // El producto ya existe en el carrito, verificar si hay suficiente stock para aumentar la cantidad

      if (product.stock < cart.productos[productIndex].quantity + quantity) {
        return _res_
          .status(400)
          .send({ message: "Not enough stock available" });
      }

      cart.productos[productIndex].quantity += quantity;
    } else {
      // Nuevo producto, agregar al carrito con la cantidad especificada

      cart.productos.push({ product: pId, quantity: quantity });
    }

    // Descontar el stock del producto

    product.stock -= quantity;

    await product.save();

    await cart.save();

    _res_.status(200).send({ message: "Product added to cart" });
  } catch (error) {
    console.error(error);

    _res_.status(500).send({ message: "Error: Product not added" });
  }
});

// Actualizar quantity de Producto en carrito XXX
cartsRoutes.put("/:cId/product/:pId", async (req, res) => {
  try {
    const { cId, pId } = req.params;
    const { quantity } = req.body;

    if (!cId || !pId || !quantity) {
      return res.status(400).json({ message: "Missing data" });
    }

    const cart = await cartsModel.findOne({ _id: cId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productoIndex = cart.productos.findIndex(
      (product) => product.product.toString() === pId
    );

    if (productoIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.productos[productoIndex].quantity = quantity;
    await cart.save();

    res.json({ message: "Product updated" });
  } catch (error) {
    res.status(500).json({ message: "Product not updated" });
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
cartsRoutes.delete("/:cId/cart", async (req, res) => {
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

    const existingCart = await cartsModel.updateOne(
      { _id: cId },
      {
        productos: [],
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
cartsRoutes.delete("/:cId/product/:pId", async (req, res) => {
  try {
    const { pId, cId } = req.params;
    const result = await cartsModel.updateOne(
      { _id: cId },
      {
        $pull: { productos: { product: new mongoose.Types.ObjectId(pId) } },
      }
    );

    res.send({ message: "Product deleted" });
  } catch (error) {
    res.status(404).send({ message: "Product not found" });
  }
});

export default cartsRoutes;
