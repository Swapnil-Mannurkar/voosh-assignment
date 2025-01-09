import { Request, Response } from "express";
import { createResponse } from "../utils/helper/response-structure";
import {
  IAlbumCreation,
  IAlbumPopulated,
  IAlbumUpdate,
} from "../utils/types/album";
import { checkAlbumMissingField } from "../utils/helper/missing-field";
import Album from "../models/album";
import Artist from "../models/artist.model";
import { ITokenUserDetails } from "../utils/types/user";
import { IArtist } from "../utils/types/artists";

class AlbumController {
  async getAllAlbums(req: Request, res: Response) {
    try {
      const userDetails: ITokenUserDetails = JSON.parse(
        req.headers.user as string
      );
      const limit = Number(req.query.limit) || 5;
      const offset = Number(req.query.offset) || 0;
      const artistId = req.query.artist_id as string;
      const hidden = req.query.hidden as string;

      let albums = (await Album.find({
        organisationId: userDetails.organisationId,
      })
        .populate("artistId")
        .skip(offset)
        .limit(limit)) as unknown as IAlbumPopulated[];

      if (artistId) {
        albums = albums.filter(
          (album) => album.artistId._id.toString() === artistId
        );
      }

      if (hidden) {
        albums = albums.filter((album) => album.hidden.toString() === hidden);
      }

      const filteredAlbums = albums.map((album) => ({
        album_id: album._id,
        artist_name: album.artistId.name,
        name: album.name,
        year: album.year,
        hidden: album.hidden,
      }));

      const response = createResponse(
        200,
        "Artists retrieved successfully",
        filteredAlbums
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

  async getAlbumById(req: Request, res: Response) {
    try {
      const userDetails: ITokenUserDetails = JSON.parse(
        req.headers.user as string
      );
      const albumId = req.params.album_id;

      if (!albumId) {
        const response = createResponse(400, "Album ID is required");
        res.status(400).send(response);
        return;
      }

      let album: IAlbumPopulated;

      try {
        album = (await Album.findOne({
          _id: albumId,
          organisationId: userDetails.organisationId,
        }).populate("artistId")) as unknown as IAlbumPopulated;
      } catch (err) {
        const response = createResponse(404, "Album not found");
        res.status(404).send(response);
        return;
      }

      if (!album) {
        const response = createResponse(404, "Album not found");
        res.status(404).send(response);
        return;
      }

      const response = createResponse(200, "Album retrieved successfully", {
        album_id: album._id,
        artist_name: album.artistId.name,
        name: album.name,
        year: album.year,
        hidden: album.hidden,
      });
      res.status(200).send(response);
      return;
    } catch (error: any) {
      const response = createResponse(
        500,
        "Failed to get album by ID",
        null,
        error.message
      );
      res.status(500).send(response);
      return;
    }
  }

  async createAlbum(req: Request, res: Response) {
    try {
      const adminDetails = JSON.parse(req.headers.user as string);
      const albumDetails: IAlbumCreation = req.body;

      if (!albumDetails.artist_id) {
        const response = createResponse(
          400,
          "Bad Request, Reason: Missing Field Artist ID"
        );
        res.status(400).send(response);
        return;
      }
      let artistDetails: IArtist;

      try {
        artistDetails = (await Artist.findOne({
          _id: albumDetails.artist_id,
          organisationId: adminDetails.organisationId,
        })) as IArtist;
      } catch (error) {
        const response = createResponse(404, "Artist not found");
        res.status(404).send(response);
        return;
      }

      if (!artistDetails) {
        const response = createResponse(404, "Artist not found");
        res.status(404).send(response);
        return;
      }

      if (!albumDetails.name || !albumDetails.year) {
        const response = createResponse(
          400,
          checkAlbumMissingField(albumDetails.name, albumDetails.year)
        );
        res.status(400).send(response);
        return;
      }

      const albumExistsDetails = await Album.findOne({
        name: albumDetails.name,
        organisationId: adminDetails.organisationId,
      });

      if (albumExistsDetails) {
        const response = createResponse(
          409,
          "Album with same name already exists."
        );
        res.status(409).send(response);
        return;
      }

      if (!albumDetails.hidden) {
        albumDetails.hidden = false;
      }

      await Album.create({
        artistId: albumDetails.artist_id,
        name: albumDetails.name,
        organisationId: adminDetails.organisationId,
        year: albumDetails.year,
        hidden: albumDetails.hidden,
      });

      const response = createResponse(201, "Album created successfully.");
      res.status(201).send(response);
    } catch (error: any) {
      const response = createResponse(
        500,
        "Failed to create album",
        null,
        error.message
      );
      res.status(500).send(response);
      return;
    }
  }

  async updateAlbum(req: Request, res: Response) {
    try {
      const adminDetails = JSON.parse(req.headers.user as string);
      const albumId = req.params.album_id;
      const updatAlbumDetails: IAlbumUpdate = req.body;

      if (!albumId) {
        const response = createResponse(400, "Album ID is required");
        res.status(400).send(response);
        return;
      }

      let album: IAlbumPopulated;
      try {
        album = (await Album.findById(albumId).populate(
          "artistId"
        )) as unknown as IAlbumPopulated;
      } catch (err) {
        const response = createResponse(404, "Album not found");
        res.status(404).send(response);
        return;
      }

      if (!album) {
        const response = createResponse(404, "Album not found");
        res.status(404).send(response);
        return;
      }

      if (album.name === updatAlbumDetails.name) {
        const response = createResponse(
          409,
          "Failed to update album, name already exists."
        );
        res.status(409).send(response);
        return;
      }

      if (
        album.organisationId.toString() !==
        adminDetails.organisationId.toString()
      ) {
        const response = createResponse(
          403,
          "Forbidden. You are not authorized to update this album."
        );
        res.status(403).send(response);
        return;
      }

      await Album.findByIdAndUpdate(albumId, {
        ...updatAlbumDetails,
      });

      res.status(204).send();
      return;
    } catch (error: any) {
      const response = createResponse(
        500,
        "Failed to update album",
        null,
        error.message
      );
      res.status(500).send(response);
      return;
    }
  }

  async deleteAlbum(req: Request, res: Response) {
    try {
      const adminDetails = JSON.parse(req.headers.user as string);
      const albumId = req.params.album_id;
      if (!albumId) {
        const response = createResponse(400, "Album ID is required");
        res.status(400).send(response);
        return;
      }

      let album: IAlbumPopulated;
      try {
        album = (await Album.findById(albumId).populate(
          "artistId"
        )) as unknown as IAlbumPopulated;
      } catch (err) {
        const response = createResponse(404, "Album not found");
        res.status(404).send(response);
        return;
      }

      if (!album) {
        const response = createResponse(404, "Album not found");
        res.status(404).send(response);
        return;
      }

      if (
        album.organisationId.toString() !==
        adminDetails.organisationId.toString()
      ) {
        const response = createResponse(
          403,
          "Forbidden. You are not authorized to delete this album."
        );
        res.status(403).send(response);
        return;
      }

      await Album.findByIdAndDelete(albumId);

      const response = createResponse(200, "Album deleted successfully");
      res.status(200).send(response);
      return;
    } catch (error: any) {
      const response = createResponse(
        500,
        "Failed to delete album",
        null,
        error.message
      );
      res.status(500).send(response);
      return;
    }
  }
}

export default AlbumController;
