import { model, Schema } from "mongoose";

const FavoriteSchema = new Schema(
  {
    category: {
      type: String,
      enum: ["artist", "album", "track"],
      required: true,
    },
    itemId: { type: Schema.Types.ObjectId, required: true },
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

const Favorite = model("Favorite", FavoriteSchema);
export default Favorite;
