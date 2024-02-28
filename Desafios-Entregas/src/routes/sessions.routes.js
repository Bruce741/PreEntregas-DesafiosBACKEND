import { Router } from "express";
import { userModel } from "../dao/models/user.model.js";

const sessionsRoutes = Router();

// Register
sessionsRoutes.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  try {
    const user = await userModel.create({
      first_name,
      last_name,
      age,
      email,
      password,
    });

    if (
      user.email === "adminCoder@coder.com" &&
      user.password === "adminCod3r123"
    ) {
      await userModel.findOneAndUpdate({ email: user.email }, { rol: "admin" });
    }

    req.session.user = user;
    res.redirect("/products");
  } catch (error) {
    console.log(error);
    res.status(400).send({ error });
  }
});

// Login
sessionsRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    if (user.password !== password) {
      return res.status(401).send({ message: "Invalid password" });
    }
    req.session.user = user;
    res.redirect("/products");
  } catch (error) {
    res.status(400).send({ error });
  }
});

// Logout
sessionsRoutes.post("/logout", async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error to logout" });
      }
    });
    res.send({ redirect: "http://localhost:8080/login" });
  } catch (error) {
    res.status(400).send({ error });
  }
});

export default sessionsRoutes;
