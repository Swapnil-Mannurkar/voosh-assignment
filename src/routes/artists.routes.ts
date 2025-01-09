import { Router } from "express";
import authMiddleware from "../middleware/auth";
import ArtistsController from "../controller/artists.controller";
import verifyAdminOrEditor from "../middleware/editorAdmin";

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
      verifyAdminOrEditor,
      this.controller.createArtists
    );
    this.router.put(
      "/:artist_id",
      authMiddleware,
      verifyAdminOrEditor,
      this.controller.updateArtist
    );
    this.router.delete(
      "/:artist_id",
      authMiddleware,
      verifyAdminOrEditor,
      this.controller.deleteArtist
    );
  }
}

export default new ArtistsRoutes().router;
