import { model, Schema } from "mongoose";

const AlbumSchema = new Schema(
  {
    albumId: { type: String, required: true },
    artistId: { type: Schema.Types.ObjectId, ref: "Artist", required: true },
    name: { type: String, required: true },
    year: { type: Number, required: true },
    hidden: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

const Album = model("Album", AlbumSchema);
export default Album;
