import { Router } from "express";
import { productsModel } from "../dao/models/products.models.js";
import { cartsModel } from "../dao/models/carts.models.js";
import { checkNotLogged, checkExistingUser} from "../middlewares/auth.js";
const viewsRoutes = Router();

// Vista index
viewsRoutes.get("/", checkNotLogged ,async (req, res) => {
  const { user } = req.session;
  res.render("index", user);
});

// Vista para añadir productos //
viewsRoutes.get("/add-products", (req, res) => {
  res.render("add-products");
});

// Vista de los productos // 
viewsRoutes.get("/products", async (req, res) => {
  const { user } = req.session;
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

  // 
  const isAdmin = user.rol === "admin";
  console.log(isAdmin)
  res.render("products", { user, isAdmin, products });
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

    res.render("cart", cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching cart details" });
  }
});

// Vista de login
viewsRoutes.get("/login", checkExistingUser, async (req, res) => {
  res.render("login");
});

// Vista de register
viewsRoutes.get("/register", checkExistingUser, async (req,res) => {
  res.render("register");
})

// Vista failedRegister
viewsRoutes.get("/failedRegister", async (req,res) => {
  res.render("failedRegister");
})

// Vista failedLogin
viewsRoutes.get("/failedLogin", async (req,res) => {
  res.render("failedLogin");
})

export default viewsRoutes;
