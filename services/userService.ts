import User from "@/models/User";
import { IUser } from "@/types/user";

export async function findUserByProviderId(providerId: string) {
  return await User.findOne({ provider_id: providerId });
}

export async function createUser(providerId: string): Promise<IUser> {
  const newUser = new User({
    provider_id: providerId,
    products: [],
  });
  return await newUser.save();
}
