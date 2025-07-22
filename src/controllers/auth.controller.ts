import { Request, Response } from "express";
import { prisma } from "../config/prisma";

class AuthController {
  // Register Function
  public async register(req: Request, res: Response) {
    try {
      const newUser = await prisma.accounts.create({
        data: { ...req.body },
      });
      res.status(201).send({
        success: true,
        message: "Add Data Success",
        data: newUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
}

export default AuthController;
