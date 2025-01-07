import { model, Schema } from "mongoose";

const TrackSchema = new Schema(
  {
    trackId: { type: String, required: true },
    artistId: { type: Schema.Types.ObjectId, ref: "Artist", required: true },
    albumId: { type: Schema.Types.ObjectId, ref: "Album", required: true },
    name: { type: String, required: true },
    duration: { type: Number, required: true },
    hidden: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

const Track = model("Track", TrackSchema);
export default Track;
