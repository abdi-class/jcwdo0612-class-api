import { Request, Response } from "express";
import { prisma } from "../config/prisma";

class AccountsController {
  public async getAllData(req: Request, res: Response) {
    try {
      const accounts = await prisma.accounts.findMany();

      res.status(200).send(accounts);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }

  public async deleteAccount(req: Request, res: Response) {
    try {
      await prisma.accounts.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });

      res.status(200).send({
        success: true,
        message: "Delete success",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
}

export default AccountsController;
