import { Document, model, Schema } from "mongoose";
import { IFavoriteModel } from "../utils/types/favorite";

type IFavoriteDoc = Document | IFavoriteModel;

const FavoriteSchema = new Schema(
  {
    category: {
      type: String,
      enum: ["artist", "album", "track"],
      required: true,
    },
    itemId: { type: Schema.Types.ObjectId, required: true },
    userId: { type: Schema.Types.ObjectId, required: true },
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

const Favorite = model<IFavoriteDoc>("Favorite", FavoriteSchema);
export default Favorite;
