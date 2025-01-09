import { Document, model, Schema } from "mongoose";
import { IArtistModel } from "../utils/types/artists";

type IArtistDoc = Document | IArtistModel;

const ArtistSchema = new Schema(
  {
    grammy: { type: Number, required: true },
    hidden: { type: Boolean, required: true },
    name: { type: String, required: true },
    organisationId: {
      type: Schema.Types.ObjectId,
      ref: "Organisation",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Artist = model<IArtistDoc>("Artist", ArtistSchema);
export default Artist;
