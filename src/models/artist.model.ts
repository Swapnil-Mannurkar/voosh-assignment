import { model, Schema } from "mongoose";

const ArtistSchema = new Schema(
  {
    artistId: { type: String, required: true },
    name: { type: String, required: true },
    grammy: { type: String, required: true },
    hidden: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

const Artist = model("Artist", ArtistSchema);
export default Artist;
