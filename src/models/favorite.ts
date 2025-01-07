import { model, Schema } from "mongoose";

const FavoriteSchema = new Schema(
  {
    favoriteId: { type: String, required: true },
    category: {
      type: String,
      enum: ["artist", "album", "track"],
      required: true,
    },
    itemId: { type: String, required: true },
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Favorite = model("Favorite", FavoriteSchema);
export default Favorite;
