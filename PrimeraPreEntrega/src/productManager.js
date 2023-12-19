import fs from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
  }

  static id = 0;

  addProduct = async (title, description, price, thumbnail, code, stock) => {
    ProductManager.id++;
    let newProduct = {
      title: title,
      description: description,
      price: price,
      thumbnail: thumbnail,
      code: code,
      stock: stock,
      available: available,
      category: category,
      id: ProductManager.id,
    };

    this.products.push(newProduct);

    await fs.promises.writeFile(this.path, JSON.stringify(this.products));
  };

  getProducts = async () => {
    try {
      let productosLeidos = await fs.promises.readFile(this.path, "utf-8");
      if (!productosLeidos.trim()) {
        return []; 
      }
      return JSON.parse(productosLeidos);
    } catch (error) {
      console.error(error);
      return []; 
    }
  };

  getProductsById = async (id) => {
    let productos = await this.getProducts();
    let productoId = productos.find((producto) => producto.id == +id);

    if (!productoId) {
      return null;
    }

    return productoId;
  };

  updateProduct = async (id, update) => {
    let productos = await this.getProducts();
    let index = productos.findIndex((producto) => producto.id == +id);

    productos[index] = {
      ...productos[index],
      ...update,
      id: id,
    };

    await fs.promises.writeFile(this.path, JSON.stringify(productos));
  };

  deleteProduct = async (id) => {
    let productos = await this.getProducts();
    let productosBorrados = productos.filter((producto) => producto.id != +id);
    await fs.promises.writeFile(this.path, JSON.stringify(productosBorrados));
  };
}

const products = new ProductManager();

export default ProductManager;
