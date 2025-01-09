import { Router } from "express";
import FavoriteController from "../controller/favorite.controller";
import authMiddleware from "../middleware/auth";

class FavoriteRoutes {
  router = Router();
  controller = new FavoriteController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      "/:category",
      authMiddleware,
      this.controller.getFavoriteByCategory
    );
    this.router.post(
      "/add-favorite",
      authMiddleware,
      this.controller.addFavorite
    );
    this.router.delete(
      "/remove-favorite/:favorite_id",
      authMiddleware,
      this.controller.removeFavorite
    );
  }
}

export default new FavoriteRoutes().router;
