import mongoose from "mongoose";

const userCollection = 'users';

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        requiered: true
    },
    last_name: {
        type: String,
        requiered: true
    },
    email: {
        type: String,
        requiered: true,
        unique: true 
    },
    age: {
        type: Number,
        requiered: true
    },
    password: {
        type: String,
        required: true
    }
});

export const userModel = mongoose.model(userCollection, userSchema);