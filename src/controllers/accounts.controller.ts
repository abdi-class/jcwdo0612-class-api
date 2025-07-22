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

  public async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { username, email, password } = req.body;

            const account = await prisma.accounts.update({
                where: { id: parseInt(id) },
                data: { username, email, password },
            });
            res.status(200).send("berhasil update icik bos");
        } catch (error) {
            res.status(500).send("internal server error");
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