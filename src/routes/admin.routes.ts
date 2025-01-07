import { Router } from "express";
import AdminController from "../controller/admin.controller";
import { authMiddleware } from "../middleware/auth";

class AdminRoutes {
  router = Router();
  controller = new AdminController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/signup", this.controller.createAdmin);
    this.router.post("/login", this.controller.loginUser);
    this.router.get("/logout", authMiddleware, this.controller.logoutUser);
  }
}

export default new AdminRoutes().router;
