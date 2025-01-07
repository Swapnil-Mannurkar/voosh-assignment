import { Application } from "express";
import adminRoutes from "./admin.routes";

export default class Routes {
  constructor(app: Application) {
    app.use("/", adminRoutes);
  }
}
