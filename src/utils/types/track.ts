import { ObjectId } from "mongodb";

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

export interface ITrackCreationDetails {
  album_id: ObjectId;
  artist_id: ObjectId;
  duration: number;
  hidden: boolean;
  name: string;
}
