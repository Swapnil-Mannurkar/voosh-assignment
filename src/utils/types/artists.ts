import { ObjectId } from "mongodb";

export interface IArtistModel extends IArtistCreation {
  createdAt: Date;
  updatedAt: Date;
}

export interface IArtist extends IArtistCreation {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface IArtistCreation {
  name: string;
  grammy: number;
  hidden: boolean;
  organisationId: ObjectId;
}

export interface IArtistUpdateDetails {
  name?: string;
  grammy?: number;
  hidden?: boolean;
}
