import { ObjectId } from "mongodb";
import { IArtist } from "./artists";

export interface IAlbumModel {
  artistId: ObjectId;
  name: string;
  organisationId: ObjectId;
  year: number;
  hidden: boolean;
}

export interface IAlbumCreation {
  artist_id: string;
  name: string;
  year: number;
  hidden: boolean;
}

export interface IAlbum extends IAlbumModel {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface IAlbumPopulated {
  _id: ObjectId;
  artistId: IArtist;
  name: string;
  organisationId: ObjectId;
  year: number;
  hidden: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface IAlbumUpdate {
  name?: string;
  year?: number;
  hidden?: boolean;
}

export interface IAlbumQuery {
  organisationId: ObjectId;
  artistId?: string;
  hidden?: string;
}
