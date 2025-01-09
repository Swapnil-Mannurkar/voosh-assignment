import { Router } from "express";
import authMiddleware from "../middleware/auth";
import verifyAdmin from "../middleware/admin";
import AlbumController from "../controller/album.controller";

class AlbumRoutes {
  router = Router();
  controller = new AlbumController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/", authMiddleware, this.controller.getAllAlbums);
    this.router.get("/:album_id", authMiddleware, this.controller.getAlbumById);
    this.router.post(
      "/add-album",
      authMiddleware,
      verifyAdmin,
      this.controller.createAlbum
    );
    this.router.put(
      "/:album_id",
      authMiddleware,
      verifyAdmin,
      this.controller.updateAlbum
    );
    this.router.delete(
      "/:album_id",
      authMiddleware,
      verifyAdmin,
      this.controller.deleteAlbum
    );
  }
}

export default new AlbumRoutes().router;
