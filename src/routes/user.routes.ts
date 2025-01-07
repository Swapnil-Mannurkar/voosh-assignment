import { Router } from "express";
import UserController from "../controller/user.controller";
import { authMiddleware } from "../middleware/auth";
import verifyAdmin from "../middleware/admin";

class UserRoutes {
  router = Router();
  controller = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      "/",
      authMiddleware,
      verifyAdmin,
      this.controller.getAllUsers
    );
    this.router.post(
      "/add-user",
      authMiddleware,
      verifyAdmin,
      this.controller.createUser
    );
    this.router.put(
      "/update-password",
      authMiddleware,
      this.controller.updatePassword
    );
    this.router.delete("/:user_id", authMiddleware, this.controller.deleteUser);
  }
}

export default new UserRoutes().router;
