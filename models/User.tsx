import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema(
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

const userSchema = new Schema({
  provider_id: { type: String, required: true, index: true },
  first_name: String,
  last_name: String,
  profile_image: String,
  email: String,
  products: [productSchema],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
