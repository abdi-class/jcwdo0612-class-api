import { sign } from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { hashPassword } from "../utils/hash";
import { transport } from "../config/nodemailer";
import { regisMailTemplate } from "../templates/regis.template";

export const regisService = async (data: any) => {
  const newUser = await prisma.accounts.create({
    data: { ...data, password: await hashPassword(data.password) },
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

  return newUser;
};
