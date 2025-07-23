import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { hashPassword } from "../utils/hash";
import { transport } from "../config/nodemailer";

class AuthController {
  // Register Function
  public async register(req: Request, res: Response) {
    try {
      const newUser = await prisma.accounts.create({
        data: { ...req.body, password: await hashPassword(req.body.password) },
      });

      await transport.sendMail({
        from: process.env.MAILSENDER,
        to: newUser.email,
        subject: "Verifikasi email",
        html: `<h1>Thank you for register account ${newUser.username}</h1>`,
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

  // #start Author : Arco
  public async loginUser(req: Request, res: Response) {
    try {
      const login = await prisma.accounts.findUnique({
        where: {
          email: req.body.email,
        },
      });

      if (!login) {
        throw { success: false, message: "Account is Not Exist" };
      }

      if (login === null) {
        res.status(404).send({ message: "Data Tidak Ditemukan" });
      } else {
        res.status(200).send({
          success: true,
          result: {
            username: login.username,
            email: login.email,
            role: login.role,
          },
        });
      }
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
  // #end Author : Arco
  // #start Author : Abdi
  public async keepLogin(req: Request, res: Response) {
    try {
      const account = await prisma.accounts.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
        omit: {
          password: true,
        },
      });

      res.status(200).send(account);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
  // #end Author : Abdi
}

export default AuthController;
