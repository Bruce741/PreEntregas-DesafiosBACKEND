import express, { urlencoded } from "express";
import cartsRoutes from "./routes/carts.routes.js";
import productsRoutes from "./routes/products.routes.js";
import handlebars from 'express-handlebars';
import viewsRouter from "./routes/views.routes.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// Configuracion Extra para path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const PORT = 8080;
const app = express();

// Express settings
app.use(express.json());
app.use(urlencoded({extended: true}));
app.use(express.static('public'));

// Cookies
app.use(cookieParser());

app.get("/setCookie", (req,res) =>{
  res.cookie('codercookie', 'Esto es una cookie', {maxAge: 5000}).send({message: "Cookie seteada"})
})


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
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'handlebars');

// Routes
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
app.use('/', viewsRouter);

app.listen(PORT, () => {
  console.log("Servido funcionando en puerto " + PORT);
});

