import { Request, Response } from "express";
import { createResponse } from "../utils/helper/response-structure";
import { ITokenUserDetails } from "../utils/types/user";
import {
  ITrack,
  ITrackCreation,
  ITrackPopulate,
  ITrackUpdate,
} from "../utils/types/track";
import { checkTrackMissingField } from "../utils/helper/missing-field";
import { IAlbum } from "../utils/types/album";
import Album from "../models/album";
import { IArtist } from "../utils/types/artists";
import Artist from "../models/artist.model";
import Track from "../models/track";

class TrackController {
  async getAllTracks(req: Request, res: Response) {
    try {
      const userDetails: ITokenUserDetails = JSON.parse(
        req.headers.user as string
      );
      const limit = Number(req.query.limit) || 5;
      const offset = Number(req.query.offset) || 0;
      const artistId = req.query.artist_id as string;
      const albumId = req.query.album_id as string;
      const hidden = req.query.hidden as string;

      const tracks = (await Track.find({
        organisationId: userDetails.organisationId,
      })
        .populate("artistId")
        .populate("albumId")
        .skip(offset)
        .limit(limit)) as unknown as ITrackPopulate[];

      if (artistId) {
        tracks.filter((track) => track.artistId.toString() === artistId);
      }

      if (albumId) {
        tracks.filter((track) => track.albumId.toString() === albumId);
      }

      if (hidden) {
        tracks.filter((track) => track.hidden.toString() === hidden);
      }

      const filteredTracks = tracks.map((track) => ({
        track_id: track._id,
        artist_name: track.artistId.name,
        album_name: track.albumId.name,
        name: track.name,
        duration: track.duration,
        hidden: track.hidden,
      }));

      const response = createResponse(
        200,
        "Track retrieved successfully.",
        filteredTracks
      );
      res.status(200).send(response);
      return;
    } catch (error: any) {
      const response = createResponse(
        500,
        "Failed to retrieve tracks.",
        null,
        error.message
      );
      res.status(500).send(response);
      return;
    }
  }

  async getTrackById(req: Request, res: Response) {
    try {
      const userDetails: ITokenUserDetails = JSON.parse(
        req.headers.user as string
      );
      const trackId = req.params.track_id;

      let track: ITrackPopulate;

      try {
        track = (await Track.findOne({
          _id: trackId,
          organisationId: userDetails.organisationId,
        })
          .populate("artistId")
          .populate("albumId")) as unknown as ITrackPopulate;
      } catch (error) {
        const response = createResponse(404, "Track not found");
        res.status(404).send(response);
        return;
      }

      if (!track) {
        const response = createResponse(404, "Track not found");
        res.status(404).send(response);
        return;
      }

      const response = createResponse(200, "Track retrieved successfully.", {
        track_id: track._id,
        artist_name: track.artistId.name,
        album_name: track.albumId.name,
        name: track.name,
        duration: track.duration,
        hidden: track.hidden,
      });
      res.status(200).send(response);
      return;
    } catch (error: any) {
      const response = createResponse(
        500,
        "Failed to retrieve track.",
        null,
        error.message
      );
      res.status(500).send(response);
      return;
    }
  }

  async createTrack(req: Request, res: Response) {
    try {
      const adminDetails: ITokenUserDetails = JSON.parse(
        req.headers.user as string
      );
      const trackDetails: ITrackCreation = req.body;

      if (!trackDetails.artist_id) {
        const response = createResponse(400, "Artist ID is required");
        res.status(400).send(response);
        return;
      }

      if (!trackDetails.album_id) {
        const response = createResponse(400, "Album ID is required");
        res.status(400).send(response);
        return;
      }

      let artistDetails: IArtist;
      try {
        artistDetails = (await Artist.findById(
          trackDetails.artist_id
        )) as IArtist;
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

      let albumDetails: IAlbum;
      try {
        albumDetails = (await Album.findOne({
          _id: trackDetails.album_id,
          artistId: trackDetails.artist_id,
        })) as IAlbum;
      } catch (error) {
        const response = createResponse(
          404,
          "Album not found or does not belong to the artist"
        );
        res.status(404).send(response);
        return;
      }

      if (!albumDetails) {
        const response = createResponse(
          404,
          "Album not found or does not belong to the artist"
        );
        res.status(404).send(response);
        return;
      }

      if (!trackDetails.duration || !trackDetails.name) {
        const response = createResponse(
          400,
          checkTrackMissingField(trackDetails.name, trackDetails.duration)
        );
        res.status(400).send(response);
        return;
      }

      const trackExists = await Track.findOne({
        name: trackDetails.name,
        organisationId: adminDetails.organisationId,
      });

      if (trackExists) {
        const response = createResponse(
          409,
          "Track with same name already exists."
        );
        res.status(409).send(response);
        return;
      }

      if (!trackDetails.hidden) {
        trackDetails.hidden = false;
      }

      await Track.create({
        albumId: trackDetails.album_id,
        artistId: trackDetails.artist_id,
        duration: trackDetails.duration,
        hidden: trackDetails.hidden,
        name: trackDetails.name,
        organisationId: adminDetails.organisationId,
      });

      const response = createResponse(201, "Track created successfully.");
      res.status(201).send(response);
      return;
    } catch (error: any) {
      const response = createResponse(
        500,
        "Failed to create track",
        null,
        error.message
      );
      res.status(500).send(response);
      return;
    }
  }

  async updateTrack(req: Request, res: Response) {
    try {
      const adminDetails: ITokenUserDetails = JSON.parse(
        req.headers.user as string
      );
      const trackId = req.params.track_id;
      const updatedTrackDetails: ITrackUpdate = req.body;

      let track: ITrack;
      try {
        track = (await Track.findById(trackId)) as ITrack;
      } catch (error) {
        const response = createResponse(404, "Track not found");
        res.status(404).send(response);
        return;
      }

      if (!track) {
        const response = createResponse(404, "Track not found");
        res.status(404).send(response);
        return;
      }

      if (
        track.organisationId.toString() !==
        adminDetails.organisationId.toString()
      ) {
        const response = createResponse(
          403,
          "Forbidden. You are not authorized to update this track."
        );
        res.status(403).send(response);
        return;
      }

      if (track.name === updatedTrackDetails.name) {
        const response = createResponse(
          400,
          "Failed to update track, name already exists."
        );
        res.status(400).send(response);
        return;
      }

      await Track.findByIdAndUpdate(trackId, updatedTrackDetails);

      res.status(204).send();
      return;
    } catch (error: any) {
      const response = createResponse(500, "Error", null, error.message);
      res.status(500).send(response);
      return;
    }
  }

  async deleteTrack(req: Request, res: Response) {
    try {
      const adminDetails: ITokenUserDetails = JSON.parse(
        req.headers.user as string
      );
      const trackId = req.params.track_id;

      let track: ITrack;
      try {
        track = (await Track.findById(trackId)) as ITrack;
      } catch (error) {
        const response = createResponse(404, "Track not found");
        res.status(404).send(response);
        return;
      }

      if (!track) {
        const response = createResponse(404, "Track not found");
        res.status(404).send(response);
        return;
      }

      if (
        track.organisationId.toString() !==
        adminDetails.organisationId.toString()
      ) {
        const response = createResponse(
          403,
          "Forbidden. You are not authorized to delete this track."
        );
        res.status(403).send(response);
        return;
      }

      await Track.findByIdAndDelete(trackId);

      const response = createResponse(
        200,
        `Track: ${track.name} deleted successfully.`
      );
      res.status(200).send(response);
      return;
    } catch (error: any) {
      const response = createResponse(500, "Error", null, error.message);
      res.status(500).send(response);
      return;
    }
  }
}

export default TrackController;
