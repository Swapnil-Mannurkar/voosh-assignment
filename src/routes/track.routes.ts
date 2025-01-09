import { Router } from "express";
import authMiddleware from "../middleware/auth";
import TrackController from "../controller/track.controller";
import verifyAdmin from "../middleware/admin";

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
      verifyAdmin,
      this.controller.createTrack
    );
    this.router.put(
      "/:track_id",
      authMiddleware,
      verifyAdmin,
      this.controller.updateTrack
    );
    this.router.delete(
      "/:track_id",
      authMiddleware,
      verifyAdmin,
      this.controller.deleteTrack
    );
  }
}

export default new TrackRoutes().router;
