import { Document, model, Schema } from "mongoose";
import { ITrackModel } from "../utils/types/track";

type ItrackDoc = Document | ITrackModel;

const TrackSchema = new Schema(
  {
    albumId: { type: Schema.Types.ObjectId, ref: "Album", required: true },
    artistId: { type: Schema.Types.ObjectId, ref: "Artist", required: true },
    duration: { type: Number, required: true },
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

const Track = model<ItrackDoc>("Track", TrackSchema);
export default Track;
