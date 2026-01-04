import User from "@/models/User";
import { IUser, ISanitizedUser } from "@/types/user";

export async function findUserByEmail(
  email: string
): Promise<ISanitizedUser | null> {
  const user = await User.findOne({ email });
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

export async function findOrCreateUser(
  providerId: string,
  email: string
): Promise<IUser> {
  // Try to find existing user by email
  let user = await User.findOne({ email });

  if (user) {
    // User exists, add provider_id if not already present
    if (!user.provider_ids.includes(providerId)) {
      user.provider_ids.push(providerId);
      await user.save();
    }
    return user;
  }

  // Create new user
  const newUser = new User({
    email,
    provider_ids: [providerId],
  });
  return await newUser.save();
}
