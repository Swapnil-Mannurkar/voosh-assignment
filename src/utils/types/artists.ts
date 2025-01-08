import { ObjectId } from "mongodb";

export interface IArtist extends IArtistCreationDetails {
  _id: ObjectId;
  artistId: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface IArtistCreationDetails {
  name: string;
  grammy: string;
  hidden: boolean;
  organisationId: string;
}

export interface IArtistUpdateDetails {
  name?: string;
  grammy?: string;
  hidden?: boolean;
}
