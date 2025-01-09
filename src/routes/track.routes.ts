import { Router } from "express";
import authMiddleware from "../middleware/auth";
import TrackController from "../controller/track.controller";
import verifyAdminOrEditor from "../middleware/editorAdmin";

class TrackRoutes {
  router = Router();
  controller = new TrackController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/", authMiddleware, this.controller.getAllTracks);
    this.router.get("/:track_id", authMiddleware, this.controller.getTrackById);
    this.router.post(
      "/add-track",
      authMiddleware,
      verifyAdminOrEditor,
      this.controller.createTrack
    );
    this.router.put(
      "/:track_id",
      authMiddleware,
      verifyAdminOrEditor,
      this.controller.updateTrack
    );
    this.router.delete(
      "/:track_id",
      authMiddleware,
      verifyAdminOrEditor,
      this.controller.deleteTrack
    );
  }
}

export default new TrackRoutes().router;
