import express, { urlencoded } from "express";
import cartsRoutes from "./routes/carts.routes.js";
import productsRoutes from "./routes/products.routes.js";
import handlebars from 'express-handlebars';
import viewsRouter from "./routes/views.routes.js";
import mongoose from "mongoose";

const PORT = 8080;
const app = express();

// Express settings
app.use(express.json());
app.use(urlencoded({extended: true}));
app.use(express.static('public'));

// Mongo settings
mongoose.connect('mongodb+srv://lopezbruno12319:ceg6DJy3V8uTRcpM@preentrega2.4n8zuto.mongodb.net/Eccomerce')

// Handlebars setting 
const hbs = handlebars.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true
  }
})

// Handlebars settings
app.engine('handlebars', hbs.engine);
app.set('views', 'src/views');
app.set('view engine', 'handlebars');

// Routes
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
app.use('/', viewsRouter);

app.listen(PORT, () => {
  console.log("Servido funcionando en puerto " + PORT);
});

