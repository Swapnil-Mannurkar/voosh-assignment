import { Application } from "express";
import adminRoutes from "./admin.routes";
import userRoutes from "./user.routes";
import artistsRoutes from "./artists.routes";

export default class Routes {
  constructor(app: Application) {
    app.use("/", adminRoutes);
    app.use("/users", userRoutes);
    app.use("/artists", artistsRoutes);
  }
}
