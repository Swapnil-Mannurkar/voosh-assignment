import { Application } from "express";
import userRoutes from "./user.routes";

export default class Routes {
  constructor(app: Application) {
    app.use("/", userRoutes);
  }
}
