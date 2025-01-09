import { Router } from "express";
import authMiddleware from "../middleware/auth";
import AlbumController from "../controller/album.controller";
import verifyAdminOrEditor from "../middleware/editorAdmin";

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
      verifyAdminOrEditor,
      this.controller.createAlbum
    );
    this.router.put(
      "/:album_id",
      authMiddleware,
      verifyAdminOrEditor,
      this.controller.updateAlbum
    );
    this.router.delete(
      "/:album_id",
      authMiddleware,
      verifyAdminOrEditor,
      this.controller.deleteAlbum
    );
  }
}

export default new AlbumRoutes().router;
