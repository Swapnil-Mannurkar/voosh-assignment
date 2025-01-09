import { ObjectId } from "mongodb";
import { IAlbum } from "./album";
import { IArtist } from "./artists";

export interface ITrackModel {
  albumId: ObjectId;
  artistId: ObjectId;
  duration: number;
  hidden: boolean;
  name: string;
  organisationId: ObjectId;
}

export interface ITrack extends ITrackModel {
  _id: ObjectId;
  __v: number;
}

export interface ITrackCreation {
  album_id: ObjectId;
  artist_id: ObjectId;
  duration: number;
  hidden: boolean;
  name: string;
}

export interface ITrackPopulate {
  _id: ObjectId;
  albumId: IAlbum;
  artistId: IArtist;
  duration: number;
  hidden: boolean;
  name: string;
  organisationId: ObjectId;
  __v: number;
}

export interface ITrackUpdate {
  duration?: number;
  hidden?: boolean;
  name?: string;
}
