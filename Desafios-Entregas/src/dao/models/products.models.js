import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = 'products';

const productsSchema = mongoose.Schema({
    title: String,
    description: String,
    code: {
        type: String,
        index: true,
        unique: true
    },
    price: Number,
    available: String,
    stock: Number,
    category: String,
    thumbnails: String,
})

productsSchema.plugin(mongoosePaginate);

export const productsModel = mongoose.model(productsCollection, productsSchema)