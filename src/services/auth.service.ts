import { prisma } from "../config/prisma";
import { hashPassword } from "../utils/hash";
import { compare } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { Accounts } from "../../prisma/generated/client";
import type { Secret, SignOptions } from "jsonwebtoken";
import { transport } from "../config/nodemailer";
import {
  regisMailTemplate,
  resetPasswordTemplate,
} from "../templates/regis.template";
import { create } from "domain";
import { createAccount } from "../repositories/auth.repository";
import { createToken } from "../utils/createToken";

export class AuthService {
  // Registrasi user baru
  async register(data: any) {
    const newUser = await createAccount(data);

    const token = sign(
      {Id:newUser.id, isVerified: newUser.isVerified},
      process.env.TOKEN_KEY || "secret",
      { expiresIn: "15m" }
    );
  }

  // Login user
  async login(email: string, password: string) {
    const user = await prisma.accounts.findUnique({ where: { email } });
    if (!user) return null;
    const isValid = await compare(password, user.password);
    if (!isValid) return null;
    return user;
  }

  // Verifikasi password
  async verifyPassword(password: string, hash: string) {
    return await compare(password, hash);
  }

  // Generate JWT token
  generateToken(user: any, expiresIn: any) {
    const token = createToken(user, expiresIn);
    return token;
    };
  }

  // Verifikasi JWT token
  verifyToken(token: string) {
    try {
      return verify(token, process.env.TOKEN_KEY || "secret");
    } catch (err) {
      return null;
    }
  }

  // Mengirim email verifikasi ke user baru
  async sendVerificationEmail(user: Accounts, token: string) {
    const urlToFE = `${process.env.FE_URL}/verify/${token}`;
    await transport.sendMail({
      from: process.env.MAILSENDER,
      to: user.email,
      subject: "Verifikasi email",
      html: regisMailTemplate(user.username, urlToFE),
    });

    return {
      success: true,
      message: "Verification email sent",
    };
  }

  // Mengirim email reset password ke user
  async sendResetPasswordEmail(user: Accounts, token: string) {
    const urlToFE = `${process.env.FE_URL}/reset-password/${token}`;
    await transport.sendMail({
      from: process.env.MAILSENDER,
      to: user.email,
      subject: "Reset Password",
      html: resetPasswordTemplate(user.username, urlToFE),
    });

    return {
      success: true,
      message: "Reset password email sent",
    };
  }
}

export const authService = new AuthService();
