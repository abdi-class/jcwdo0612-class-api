import { prisma } from "../config/prisma";
import { hashPassword } from "../utils/hash";

export const createAccount = async (data: any) => {
  return prisma.accounts.create({
    data: {
      ...data,
      password: await hashPassword(data.password),
    },
  });
};

export const findAccount = async (email: string) => {
  return prisma.accounts.findUnique({
    where: {
      email,
    },
  });
};
