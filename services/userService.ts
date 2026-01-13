import User from "@/models/User";
import { IUser, ISanitizedUser } from "@/types/user";

export async function findUserByProviderId(
  providerId: string
): Promise<ISanitizedUser | null> {

  const user = await User.findOne({ provider_id: providerId });
  if (!user) {
    return null;
  }

  const sanitizedUser: ISanitizedUser = {
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    profile_image: user.profile_image,
    email: user.email,
    products: user.products,
  };
  return sanitizedUser;
}

export async function createUser(providerId: string): Promise<IUser> {
  const newUser = new User({
    provider_id: providerId,
  });
  return await newUser.save();
}
