import express, { urlencoded } from "express";
import cartsRouter from "./routes/carts.routes.js";
import productsRoutes from "./routes/products.routes.js";
import handlebars from 'express-handlebars';
import viewsRouter from "./routes/views.routes.js";
import { Server} from 'socket.io';

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(urlencoded({extended: true}));
app.use(express.static('public'));

// Handlebars setting 
app.engine('handlebars', handlebars.engine());
app.set('views', 'src/views');
app.set('view engine', 'handlebars');


app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRouter);
app.use('/', viewsRouter);

const httpServer = app.listen(PORT, () => {
  console.log("Servido funcionando en puerto " + PORT);
});

const io = new Server(httpServer);
