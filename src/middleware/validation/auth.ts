import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const validationHandler = (req: Request, res: Response, next: NextFunction) => {
  try {
    const erroValidation = validationResult(req);
    if (!erroValidation.isEmpty()) {
      throw erroValidation.array();
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const regisValidation = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").notEmpty().isEmail().withMessage("Email is required"),
  body("password").notEmpty().isStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }),
  validationHandler,
];
