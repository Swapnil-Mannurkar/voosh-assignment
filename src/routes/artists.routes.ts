import { Router } from "express";
import authMiddleware from "../middleware/auth";
import verifyAdmin from "../middleware/admin";
import ArtistsController from "../controller/artists.controller";

class ArtistsRoutes {
  router = Router();
  controller = new ArtistsController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/", authMiddleware, this.controller.getAllArtists);
    this.router.get(
      "/:artist_id",
      authMiddleware,
      this.controller.getArtistById
    );
    this.router.post(
      "/add-artist",
      authMiddleware,
      verifyAdmin,
      this.controller.createArtists
    );
    this.router.put(
      "/:artist_id",
      authMiddleware,
      verifyAdmin,
      this.controller.updateArtist
    );
    this.router.delete(
      "/:artist_id",
      authMiddleware,
      verifyAdmin,
      this.controller.deleteArtist
    );
  }
}

export default new ArtistsRoutes().router;
