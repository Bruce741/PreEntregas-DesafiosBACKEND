import { Router } from "express";
import { productsModel } from "../dao/models/products.models.js";
import { cartsModel } from "../dao/models/carts.models.js";
import { checkLogged, checkExistingUser} from "../middlewares/auth.js";
const viewsRoutes = Router();

// Vista index
viewsRoutes.get("/", checkLogged ,async (req, res) => {
  const { user } = req.session;
  res.render("index", user);
});

// Vista para añadir productos //
viewsRoutes.get("/add-products", (req, res) => {
  res.render("add-products");
});

// Vista de los productos // (Falta poder añadir productos a carrito)
viewsRoutes.get("/products", async (req, res) => {
  const { limit = 10, page = 1, query = "", sort = "" } = req.query;
  const [code, value] = query.split(":");
  const products = await productsModel.paginate(
    { [code]: value },
    {
      limit,
      page,
      sort: sort ? { precio: sort } : {},
    }
  );
  products.payload = products.docs;
  delete products.docs;
  res.render("products", products);
});

// Vista del carro
viewsRoutes.get("/carts/:cId", async (req, res) => {
  try {
    const { cId } = req.params;
    const cart = await cartsModel
      .findOne({ _id: cId })
      .populate("products.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart Not Found" });
    }

    res.render("cart", { cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching cart details" });
  }
});

// Vista de login
viewsRoutes.get("/login", checkExistingUser,async (req, res) => {
  res.render("login");
});

// Vista de register
viewsRoutes.get("/register", checkExistingUser, async (req,res) => {
  res.render("register");
})

export default viewsRoutes;
