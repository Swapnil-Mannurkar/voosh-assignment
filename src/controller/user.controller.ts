import { Request, Response } from "express";

export default class UserController {
  helloWorld(_req: Request, res: Response) {
    res.status(200).send({ message: "Hello Swapnil!" });
  }
}
