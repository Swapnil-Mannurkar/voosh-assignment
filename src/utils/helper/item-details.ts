import Album from "../../models/album";
import Artist from "../../models/artist.model";
import Track from "../../models/track";
import { IAlbum } from "../types/album";
import { IArtist } from "../types/artists";
import { IfavoriteCreation } from "../types/favorite";
import { ITrack } from "../types/track";
import { ObjectId } from "mongodb";

export const getItemDetails = async (
  favoriteDetails: IfavoriteCreation,
  organisationId: ObjectId
) => {
  try {
    switch (favoriteDetails.category.toLowerCase()) {
      case "artist":
        const artistItem = (await Artist.findOne({
          _id: favoriteDetails.item_id,
          organisationId,
        })) as IArtist;
        return artistItem;
      case "album":
        const albumItem = (await Album.findOne({
          _id: favoriteDetails.item_id,
          organisationId,
        })) as IAlbum;
        return albumItem;
      case "track":
        const trackItem = (await Track.findOne({
          _id: favoriteDetails.item_id,
          organisationId,
        })) as ITrack;
        return trackItem;
      default:
        throw new Error("Invalid category!");
    }
  } catch (err) {
    return null;
  }
};
