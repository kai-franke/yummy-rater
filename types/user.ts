import { Document } from "mongoose";
import { IProduct } from "./product";

export interface IUser extends Document {
  provider_id: string;
  first_name?: string;
  last_name?: string;
  profile_image?: string;
  email?: string;
  products?: IProduct[];
}

export interface ISanitizedUser {
  id: string;
  provider_id: string;
  first_name?: string;
  last_name?: string;
  profile_image?: string;
  email?: string;
  products?: IProduct[];
}
