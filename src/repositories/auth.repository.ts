import {prisma} from "../config/prisma";
import { hashPassword } from "../utils/hash";

export const createAccount = async (data:any) => {
    return await prisma.accounts.create({
        data: {
            ...data,
            password: await hashPassword(data.password),
        },
    });
};