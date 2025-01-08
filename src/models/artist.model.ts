import { model, Schema } from "mongoose";
import * as uuid from "uuid";

const ArtistSchema = new Schema(
  {
    artistId: { type: String, required: true, default: uuid.v4() },
    name: { type: String, required: true },
    grammy: { type: String, required: true },
    hidden: { type: Boolean, required: true },
    organisationId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Artist = model("Artist", ArtistSchema);
export default Artist;
