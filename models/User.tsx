import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  provider_id: { type: String, required: true },
  first_name: String,
  last_name: String,
  profile_image: String,
  email: String,
  // Muss products anders definiert werden?
  products: Array,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
