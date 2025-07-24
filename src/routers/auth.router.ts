import { NextFunction, Request, Response, Router } from "express";
import AuthController from "../controllers/auth.controller";
import { regisValidation } from "../middleware/validation/auth";
import { verifyToken } from "../middleware/verifyToken";
class AuthRouter {
  // define type of property
  private route: Router;
  private authController: AuthController;

  constructor() {
    this.route = Router();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.post("/signup", regisValidation, this.authController.register);

    this.route.get("/keeplogin", verifyToken, this.authController.keepLogin);
    this.route.get("/verify", verifyToken, this.authController.verifyAccount);
  }

  public getRouter(): Router {
    return this.route;
  }
}
export default AuthRouter;
