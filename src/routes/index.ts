import { Application } from "express";
import adminRoutes from "./admin.routes";
import userRoutes from "./user.routes";

export default class Routes {
  constructor(app: Application) {
    app.use("/", adminRoutes);
    app.use("/users", userRoutes);
  }
}
