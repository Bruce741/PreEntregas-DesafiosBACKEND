import { Router } from "express";
import ProductManager from "../dao/managerFS/productManager.js";
import { productsModel } from "../dao/models/products.models.js";
import { uploader } from "../utils/multer.js";

const productManager = new ProductManager("./src/productos.json");

const productsRoutes = Router();

// Obtener todos los productos
productsRoutes.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, query = "", sort = "" } = req.query;
    const [code, value] = query.split(":");
    const products = await productsModel.paginate({[code]: value}, {
      limit,
      page,
      sort: sort ? {precio: sort} : {}
    });
    products.payload = products.docs;
    delete products.docs;
    if(products){
      return res.send({message: "ok", ...products} )
    }
    else{
      res.status(400).json({message: 'No encontrado'})
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error al obtener todos los productos" });
  }
}); 

// Obtener Productos por el ID
productsRoutes.get("/:id", async (req, res) => {
  const { id } = req.params;
  let product = await productsModel.findOne({ _id: id });

  if (!product) {
     res.send("Producto no encontrado");
  }

  return res.send({ product });
});

// Añadir productos
productsRoutes.post("/", uploader.single('file'), async (req, res) => {
  try {
    const newProduct = req.body;
    const path = req.file ? req.file.path.split('public').join('') : '';
    const added = await productsModel.create({...newProduct, thumbnails: path} );
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

    const existingProduct = await productsModel.findOne({ _id: pid });
    if (!existingProduct) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    const update = await productsModel.updateOne({ _id: pid }, updatedInfo);

    if (update.ModifiedCount > 0) {
      return res.status(201).json({ message: "Product Updated" });
    }
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

    const existingProduct = await productsModel.findOne({ _id: pid });
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
