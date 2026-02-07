import { Document } from "mongoose";

export interface IProduct {
  ean: number;
  name?: string;
  brand?: string;
  description?: string;
  image?: string;
  public_id?: string;
  user_rating?: number;
  user_note?: string;
  createdAt?: Date; 
}

export interface IProductNoMongoose {
  ean: number;
  name?: string;
  brand?: string;
  description?: string;
  image?: string;
  user_rating?: number;
  user_note?: string;
}
