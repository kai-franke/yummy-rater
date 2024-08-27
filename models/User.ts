import mongoose, { Model, models, model } from "mongoose";
import { IUser } from "../types/user";
import { IProduct } from "../types/product";

const { Schema } = mongoose;

const productSchema = new Schema<IProduct>(
  {
    ean: { type: Number, required: true },
    name: String,
    brand: String,
    description: String,
    image: String,
    user_rating: Number,
    user_note: String,
  },
  { timestamps: true }
);

const userSchema = new Schema<IUser>(
  {
    provider_id: { type: String, required: true, unique: true, index: true },
    first_name: String,
    last_name: String,
    profile_image: String,
    email: String,
    products: [productSchema],
  },
  { timestamps: true }
);

const User: Model<IUser> = models.User || model<IUser>("User", userSchema);

export default User;
