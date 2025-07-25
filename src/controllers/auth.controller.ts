import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { hashPassword } from "../utils/hash";
import { transport } from "../config/nodemailer";
import { regisMailTemplate } from "../templates/regis.template";
import { compare } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { resetPasswordMailTemplate } from "../templates/resetPassword.template";

class AuthController {
  // Register Function
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const newUser = await prisma.accounts.create({
        data: { ...req.body, password: await hashPassword(req.body.password) },
      });

      // Create token for verify account
      const token = sign(
        { id: newUser.id, isVerified: newUser.isVerified },
        process.env.TOKEN_KEY || "secret",
        { expiresIn: "15m" }
      );

      // Define url to front end verify page
      const urlToFE = `${process.env.FE_URL}/verify/${token}`;

      await transport.sendMail({
        from: process.env.MAILSENDER,
        to: newUser.email,
        subject: "Verifikasi email",
        html: regisMailTemplate(newUser.username, urlToFE),
      });

      res.status(201).send({
        success: true,
        message: "Add Data Success",
        data: newUser,
      });
    } catch (error) {
      next(error);
    }
  }

  // #start Author : Arco
  public async loginUser(req: Request, res: Response, next: NextFunction) {
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
        // Validate password
        const comparePassword = await compare(
          req.body.password,
          login.password
        );

        if (!comparePassword) {
          throw { success: false, message: "Password is wrong" };
        }

        // Create token
        const token = sign(
          { id: login.id, isVerified: login.isVerified, role: login.role },
          process.env.TOKEN_KEY || "secret",
          { expiresIn: "1h" }
        );

        res.status(200).send({
          success: true,
          result: {
            username: login.username,
            email: login.email,
            isVerified: login.isVerified,
            role: login.role,
            token,
          },
        });
      }
    } catch (error) {
      next(error);
    }
  }
  // #end Author : Arco
  // #start Author : Abdi
  public async keepLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const account = await prisma.accounts.findUnique({
        where: {
          id: parseInt(res.locals.id),
        },
        omit: {
          password: true,
        },
      });

      if (!account) {
        throw { success: false, message: "Account not found" };
      }

      const token = sign(
        {
          id: account?.id,
          isVerified: account?.isVerified,
          role: account?.role,
        },
        process.env.TOKEN_KEY || "secret"
      );

      res.status(200).send({
        username: account.username,
        email: account.email,
        isVerified: account.isVerified,
        role: account.role,
        token,
      });
    } catch (error) {
      next(error);
    }
  }
  // #end Author : Abdi

  public async verifyAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const account = await prisma.accounts.update({
        where: {
          id: parseInt(res.locals.decript.id),
        },
        data: { isVerified: true },
      });
      res.status(200).send({
        success: true,
        message: "Verification success",
      });
    } catch (error) {
      next(error);
    }
  }

  public async forgetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const account = await prisma.accounts.findUnique({
        where: {
          email: req.body.email,
        },
      });

      if (!account) {
        throw { success: false, message: "Account not found" };
      }

      const token = sign(
        {
          id: account.id,
          email: account.email,
          role: account.role,
        },
        process.env.TOKEN_KEY || "secret",
        { expiresIn: "15m" }
      );

      await transport.sendMail({
        sender: process.env.MAILSENDER,
        to: account.email,
        subject: "Reset password",
        html: resetPasswordMailTemplate(
          account.username,
          `${process.env.FE_URL}/reset-password/${token}`
        ),
      });

      res.status(200).send({
        success: true,
        message: "Periksa email untuk pembaruan password",
      });
    } catch (error) {
      next(error);
    }
  }

  public async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.accounts.update({
        where: {
          id: parseInt(res.locals.decript.id),
        },
        data: {
          password: await hashPassword(req.body.password),
        },
      });

      res.status(200).send({
        success: true,
        message: "Reset password success",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
