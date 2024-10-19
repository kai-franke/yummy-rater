import { Document, ObjectId } from "mongoose";
import { IProduct } from "./product";

export interface IUser extends Document {
  _id: ObjectId;
  provider_id: string;
  first_name?: string;
  last_name?: string;
  profile_image?: string;
  email?: string;
  products: IProduct[];
}

export interface ISanitizedUser {
  _id: ObjectId;
  first_name?: string;
  last_name?: string;
  profile_image?: string;
  email?: string;
  products: IProduct[];
}
