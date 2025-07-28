import { sign } from "jsonwebtoken";

export const createToken = (user: any, expiresIn: any) => {
    const token = sign(
        { id: user.id, isVerified: user.isVerified, role: user.role },
        process.env.TOKEN_KEY || "secret",
        { expiresIn: expiresIn }
    );
    return token;
};