import { sign } from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { hashPassword } from "../utils/hash";
import { transport } from "../config/nodemailer";
import { regisMailTemplate } from "../templates/regis.template";
import { createAccount } from "../repositories/auth.repository";
import { createToken } from "../utils/createToken";
import AppError from "../errors/AppError";
import { compare } from "bcrypt";

export const regisService = async (data: any) => {
  const newUser = await createAccount(data); // function to create data in db

  // Create token for verify account
  const token = createToken(newUser, "15m");

  // Define url to front end verify page
  const urlToFE = `${process.env.FE_URL}/verify/${token}`;

  await transport.sendMail({
    from: process.env.MAILSENDER,
    to: newUser.email,
    subject: "Verifikasi email",
    html: regisMailTemplate(newUser.username, urlToFE),
  });

  return newUser;
};

export const loginService = async (data: any) => {
  const login = await prisma.accounts.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!login) {
    throw new AppError("Account is Not Exist", 404);
  } else {
    // Validate password
    const comparePassword = await compare(data.password, login.password);

    if (!comparePassword) {
      throw new AppError("Password is wrong", 401);
    }

    // Create token
    const token = createToken(login, "1h");
    return { user: login, token };
  }
};
