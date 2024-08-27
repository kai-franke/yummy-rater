import { Document } from "mongoose";

export interface IProduct extends Document {
  ean: number;
  name?: string;
  brand?: string;
  description?: string;
  image?: string;
  user_rating?: number;
  user_note?: string;
}
