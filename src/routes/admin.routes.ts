import { Router } from "express";
import AdminController from "../controller/admin.controller";

class AdminRoutes {
  router = Router();
  controller = new AdminController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/signup", this.controller.createAdmin);
  }
}

export default new AdminRoutes().router;
