import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { hashPassword } from "../utils/hash";
import { transport } from "../config/nodemailer";
import { sign } from "jsonwebtoken";
import { resetPasswordMailTemplate } from "../templates/resetPassword.template";
import AppError from "../errors/AppError";
import { loginService, regisService } from "../services/auth.service";

class AuthController {
  // Register Function
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const newUser = await regisService(req.body);

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
      const result = await loginService(req.body);

      res.status(200).send({
        success: true,
        result: {
          username: result.user.username,
          email: result.user.email,
          isVerified: result.user.isVerified,
          role: result.user.role,
          token: result.token,
        },
      });
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
          id: parseInt(res.locals.decript.id),
        },
        omit: {
          password: true,
        },
      });

      if (!account) {
        throw new AppError("Account not found", 404);
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
