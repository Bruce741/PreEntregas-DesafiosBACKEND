import { Router } from "express";
import ProductManager from "../dao/managerFS/productManager.js";
import { productsModel } from "../dao/models/products.models.js";

const productManager = new ProductManager("./src/productos.json");

const productsRoutes = Router();

// Obtener todos los productos y el limite
productsRoutes.get("/", async (req, res) => {
  const [code, value] = query.split(':')
  const { limit = 10, page = 1, query = "", sort = "" } = req.query;
  let products = await productsModel.paginate({[code]: value},{
    limit,
    page,
    sort: sort ? {price: sort} : {}
  });
  products.payload = products.docs
  delete products.docs
  if (!limit) {
    return res.send({...products});
  }

  let limitedProducts = [];
  for (let i = 0; i < limit; i++) {
    if (products[i]) {
      limitedProducts.push(products[i]);
    }
    return res.send({ limitedProducts });
  }
});

// Obtener Productos por el ID
productsRoutes.get("/:id", async (req, res) => {
  const { id } = req.params;
  let product = await productsModel.findOne({_id: id});

  if (!product) {
    return res.send("Producto no encontrado");
  }

  return res.send(product);
});

// Añadir productos
productsRoutes.post("/", async (req, res) => {
  try {
    const newProduct = req.body;
    const added = await productsModel.create(newProduct);
    res.status(201).json({ message: "Producto agregado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al agregar el producto" });
  }
});

// Actualizar producto por ID
productsRoutes.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedInfo = req.body;

    if (!pid) {
      return res.status(400).json({ message: "Missing Id" });
    }

    const existingProduct = await productsModel.findOne({_id: pid});
    if (!existingProduct) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    await productsModel.updateOne(existingProduct, updatedInfo);

    res.json({ message: "Product Updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Product not Added" });
  }
});

// Eliminar un producto por su ID
productsRoutes.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    
    if (!pid) {
      return res.status(400).json({ message: "Missing ID" });
    }

    const existingProduct = await productsModel.findOne({_id: pid});
    if (!existingProduct) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    await productsModel.deleteOne(existingProduct);

    res.json({ message: "Product Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Product Not Deleted" });
  }
});



export default productsRoutes;
