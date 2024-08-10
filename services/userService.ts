import dbConnect from "@/lib/db/dbconnect";
import User from "@/models/User";
import { IUser, ISanitizedUser } from "../types/user";
import mongoose from "mongoose";

export async function getUserByProviderId(
  providerId: string
): Promise<IUser | null> {
  await dbConnect();

  const user = await User.findOne({ provider_id: providerId });

  if (!user) {
    return null;
  }
  //remove any!
  const sanitizedUser: any = {
    //
    id: (user._id as mongoose.Types.ObjectId).valueOf(),
    provider_id: user.provider_id,
    first_name: user.first_name,
    last_name: user.last_name,
    profile_image: user.profile_image,
    email: user.email,
    products: user.products,
  };

  return sanitizedUser;
}
