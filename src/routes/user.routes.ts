import { Router } from "express";
import UserController from "../controller/user.controller";

class UserRoutes {
  router = Router();
  controller = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/", this.controller.helloWorld);
  }
}

export default new UserRoutes().router;
