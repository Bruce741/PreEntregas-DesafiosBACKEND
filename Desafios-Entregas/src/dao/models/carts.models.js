import mongoose from "mongoose";

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
    productos: {
      type: [
        {
          product: {
            type: mongoose.Schema.ObjectId,
            requiered: true,
            ref: 'products'
          },
          quantity: Number
        }
      ],
      default: []
    }
  });

export const cartsModel = mongoose.model(cartsCollection, cartsSchema)