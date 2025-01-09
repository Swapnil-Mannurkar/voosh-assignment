import { Application } from "express";
import adminRoutes from "./admin.routes";
import userRoutes from "./user.routes";
import artistsRoutes from "./artists.routes";
import albumRoutes from "./album.routes";
import trackRoutes from "./track.routes";
import favoriteRoutes from "./favorite.routes";

export default class Routes {
  constructor(app: Application) {
    app.use("/", adminRoutes);
    app.use("/users", userRoutes);
    app.use("/artists", artistsRoutes);
    app.use("/albums", albumRoutes);
    app.use("/tracks", trackRoutes);
    app.use("/favorites", favoriteRoutes);
  }
}
