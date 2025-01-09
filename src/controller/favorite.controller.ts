import { Request, Response } from "express";
import { createResponse } from "../utils/helper/response-structure";
import {
  Ifavorite,
  IFavoriteCategory,
  IfavoriteCreation,
} from "../utils/types/favorite";
import { checkFavoriteMissingField } from "../utils/helper/missing-field";
import { IArtist } from "../utils/types/artists";
import { IAlbum } from "../utils/types/album";
import { ITrack } from "../utils/types/track";
import Favorite from "../models/favorite";
import { ITokenUserDetails } from "../utils/types/user";
import { getItemDetails } from "../utils/helper/item-details";

class FavoriteController {
  async getFavoriteByCategory(req: Request, res: Response) {
    try {
      const userDetails: ITokenUserDetails = JSON.parse(
        req.headers.user as string
      );
      const category = req.params.category as IFavoriteCategory;
      const limit = Number(req.query.limit) || 5;
      const offset = Number(req.query.offset) || 0;

      if (
        category !== "album" &&
        category !== "artist" &&
        category !== "track"
      ) {
        const response = createResponse(
          400,
          "Category does not exist, category must be either album, track or artist"
        );
        res.status(400).send(response);
        return;
      }

      const favorites = (await Favorite.find({
        category,
        userId: userDetails.userId,
        organisationId: userDetails.organisationId,
      })
        .skip(offset)
        .limit(limit)) as unknown as Ifavorite[];

      const filteredFavorites = favorites.map((favorite) => ({
        favorite_id: favorite._id,
        category: favorite.category,
        item_id: favorite.itemId,
        name: favorite.name,
        createdAt: favorite.createdAt,
      }));

      const response = createResponse(
        200,
        "Favorites retrieved successfully.",
        filteredFavorites
      );
      res.status(200).send(response);
      return;
    } catch (error: any) {
      console.error(error);
      const response = createResponse(
        500,
        "Failed to retrieve favorites!",
        null,
        error.message
      );
      res.status(500).send(response);
      return;
    }
  }

  async addFavorite(req: Request, res: Response) {
    try {
      const userDetails: ITokenUserDetails = JSON.parse(
        req.headers.user as string
      );
      const favoriteDetails: IfavoriteCreation = req.body;

      if (!favoriteDetails.category || !favoriteDetails.item_id) {
        const response = createResponse(
          400,
          checkFavoriteMissingField(
            favoriteDetails.category,
            favoriteDetails.item_id
          )
        );
        res.status(400).send(response);
        return;
      }

      const itemDetails: IArtist | IAlbum | ITrack | null =
        await getItemDetails(favoriteDetails, userDetails.organisationId);

      if (!itemDetails) {
        const response = createResponse(
          404,
          `Category ${favoriteDetails.category} with item id ${favoriteDetails.item_id} does not exist!`
        );
        res.status(404).send(response);
        return;
      }

      const favorite: Ifavorite = (await Favorite.findOne({
        userId: userDetails.userId,
        category: favoriteDetails.category,
        itemId: favoriteDetails.item_id,
        organisationId: userDetails.organisationId,
      })) as Ifavorite;

      if (favorite) {
        const response = createResponse(
          409,
          "Favorite with category and item id already exists."
        );
        res.status(409).send(response);
        return;
      }

      await Favorite.create({
        userId: userDetails.userId,
        category: favoriteDetails.category,
        itemId: favoriteDetails.item_id,
        organisationId: userDetails.organisationId,
        name: itemDetails.name,
      });

      const response = createResponse(201, "Favorite added successfully.");
      res.status(201).send(response);
      return;
    } catch (error: any) {
      const response = createResponse(
        500,
        "Failed to add favorite",
        null,
        error.message
      );
      res.status(500).send(response);
      return;
    }
  }

  async removeFavorite(req: Request, res: Response) {
    try {
      const userDetails: ITokenUserDetails = JSON.parse(
        req.headers.user as string
      );
      const favoriteId = req.params.favorite_id;

      if (!favoriteId) {
        const response = createResponse(400, "Favorite id is required.");
        res.status(400).send(response);
        return;
      }

      let favorite: Ifavorite;

      try {
        favorite = (await Favorite.findById(favoriteId)) as Ifavorite;
      } catch (err) {
        const response = createResponse(404, "Favorite not found.");
        res.status(404).send(response);
        return;
      }

      if (!favorite) {
        const response = createResponse(404, "Favorite not found.");
        res.status(404).send(response);
        return;
      }

      if (
        favorite.userId.toString() !== userDetails.userId.toString() ||
        favorite.organisationId.toString() !==
          userDetails.organisationId.toString()
      ) {
        const response = createResponse(
          403,
          "Forbidden. You are not authorized to remove this favorite."
        );
        res.status(403).send(response);
        return;
      }

      await Favorite.findByIdAndDelete(favorite._id);

      const response = createResponse(200, "Favorite removed successfully.");
      res.status(200).send(response);
      return;
    } catch (error: any) {
      const response = createResponse(
        500,
        "Failed to remove favorite!",
        null,
        error.message
      );
      res.status(500).send(response);
      return;
    }
  }
}

export default FavoriteController;
