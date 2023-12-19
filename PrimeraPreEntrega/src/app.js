import express from "express";
import cartsRouter from "./routes/carts.routes.js";
import productsRoutes from "./routes/products.routes.js";

const PORT = 8080;
const app = express();

app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRouter);

app.listen(PORT, () => {
  console.log("Servido funcionando en puerto " + PORT);
});
