import { Request, Response } from "express";
import { createResponse } from "../utils/helper/response-structure";
import { ITokenUserDetails } from "../utils/types/user";
import { IArtist, IArtistCreationDetails } from "../utils/types/artists";
import { checkArtistsMissingField } from "../utils/helper/missing-field";
import Artist from "../models/artist.model";

class ArtistsController {
  async getAllArtists(req: Request, res: Response) {
    try {
      const userDetails: ITokenUserDetails = JSON.parse(
        req.headers.user as string
      );
      const limit = Number(req.query.limit) || 5;
      const offset = Number(req.query.offset) || 0;
      const grammy = req.query.grammy as string;
      const hidden = req.query.hidden as string;

      let artists: IArtist[] = await Artist.find({
        organisationId: userDetails.organisationId,
      })
        .skip(offset)
        .limit(limit);

      if (grammy) {
        artists = artists.filter((artist) => artist.grammy === grammy);
      }

      if (hidden) {
        artists = artists.filter(
          (artist) => artist.hidden.toString() === hidden
        );
      }

      const filteredArtists = artists.map((artist) => ({
        artist_id: artist.artistId,
        name: artist.name,
        grammy: artist.grammy,
        hidden: artist.hidden,
      }));

      const response = createResponse(
        200,
        "Artists fetched successfully",
        filteredArtists
      );
      res.status(200).send(response);
      return;
    } catch (error: any) {
      const response = createResponse(
        500,
        "Failed to get all artists",
        null,
        error.message
      );
      res.status(500).send(response);
      return;
    }
  }

  async getArtistById(req: Request, res: Response) {
    try {
      const userDetails: ITokenUserDetails = JSON.parse(
        req.headers.user as string
      );
      const artistId = req.params.artist_id;

      const artist = await Artist.findOne({
        artistId: artistId,
        organisationId: userDetails.organisationId,
      });

      if (!artist) {
        const response = createResponse(404, "Artist not found");
        res.status(404).send(response);
        return;
      }

      const response = createResponse(200, "Artist fetched successfully", {
        artist_id: artist.artistId,
        name: artist.name,
        grammy: artist.grammy,
        hidden: artist.hidden,
      });
      res.status(200).send(response);
      return;
    } catch (error: any) {
      const response = createResponse(
        500,
        "Failed to get artist by ID",
        null,
        error.message
      );
      res.status(500).send(response);
      return;
    }
  }

  async createArtists(req: Request, res: Response) {
    try {
      const adminDetails: ITokenUserDetails = JSON.parse(
        req.headers.user as string
      );
      const artistsDetails: IArtistCreationDetails = req.body;

      if (!artistsDetails.name || !artistsDetails.grammy) {
        const response = createResponse(
          400,
          checkArtistsMissingField(artistsDetails.name, artistsDetails.grammy)
        );
        res.status(400).send(response);
        return;
      }

      if (!artistsDetails.hidden) {
        artistsDetails.hidden = false;
      }

      await Artist.create({
        ...artistsDetails,
        organisationId: adminDetails.organisationId,
      });

      const response = createResponse(201, "Artists created successfully.");
      res.status(201).send(response);
      return;
    } catch (error: any) {
      const response = createResponse(
        500,
        "Failed to create artists",
        null,
        error.message
      );
      res.status(500).send(response);
      return;
    }
  }

  async updateArtist(req: Request, res: Response) {
    try {
      const adminDetails: ITokenUserDetails = JSON.parse(
        req.headers.user as string
      );
      const artistId = req.params.artist_id;

      if (!artistId) {
        const response = createResponse(400, "Artist ID is required");
        res.status(400).send(response);
        return;
      }

      const artistDetails = await Artist.findOne({ artistId });

      if (!artistDetails) {
        const response = createResponse(404, "Artist not found");
        res.status(404).send(response);
        return;
      }

      if (artistDetails.organisationId !== adminDetails.organisationId) {
        const response = createResponse(403, "Forbidden to update this artist");
        res.status(403).send(response);
        return;
      }
      const updatedArtist: IArtistCreationDetails = req.body;

      await Artist.findOneAndUpdate(
        { artistId: artistId, organisationId: adminDetails.organisationId },
        updatedArtist
      );

      const response = createResponse(204, "Artist updated successfully");
      res.status(204).send(response);
      return;
    } catch (error: any) {
      const response = createResponse(
        500,
        "Failed to update artist",
        null,
        error.message
      );
      res.status(500).send(response);
      return;
    }
  }

  async deleteArtist(req: Request, res: Response) {
    try {
      const adminDetails: ITokenUserDetails = JSON.parse(
        req.headers.user as string
      );
      const artistId = req.params.artist_id;

      if (!artistId) {
        const response = createResponse(400, "Artist ID is required");
        res.status(400).send(response);
        return;
      }

      const artistDetails = await Artist.findOne({ artistId });

      if (!artistDetails) {
        const response = createResponse(404, "Artist not found");
        res.status(404).send(response);
        return;
      }

      if (artistDetails.organisationId !== adminDetails.organisationId) {
        const response = createResponse(403, "Forbidden to delete this artist");
        res.status(403).send(response);
        return;
      }

      await Artist.findOneAndDelete({
        artistId: artistId,
        organisationId: adminDetails.organisationId,
      });

      const response = createResponse(
        200,
        `Artist: ${artistDetails.name} deleted successfully.`,
        {
          artist_id: artistDetails.artistId,
        }
      );

      res.status(200).send(response);
      return;
    } catch (error: any) {
      const response = createResponse(
        500,
        "Failed to delete artist",
        null,
        error.message
      );
      res.status(500).send(response);
      return;
    }
  }
}

export default ArtistsController;
