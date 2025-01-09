import { ObjectId } from "mongodb";

export interface IFavoriteModel {
  category: IFavoriteCategory;
  itemId: ObjectId;
  userId: ObjectId;
  name: string;
  organisationId: ObjectId;
}

export interface IfavoriteCreation {
  category: IFavoriteCategory;
  item_id: ObjectId;
}

export type IFavoriteCategory = "artist" | "album" | "track";

export interface Ifavorite extends IFavoriteModel {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
