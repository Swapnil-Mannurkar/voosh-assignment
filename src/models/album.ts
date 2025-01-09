import { Document, model, Schema } from "mongoose";
import { IAlbumModel } from "../utils/types/album";

type IAlbumDoc = Document | IAlbumModel;

const AlbumSchema = new Schema(
  {
    artistId: {
      type: Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
    },
    hidden: { type: Boolean, required: true },
    name: { type: String, required: true },
    organisationId: {
      type: Schema.Types.ObjectId,
      ref: "Organisation",
      required: true,
    },
    year: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Album = model<IAlbumDoc>("Album", AlbumSchema);
export default Album;
