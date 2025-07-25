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
    this.route.post("/forget-password", this.authController.forgetPassword);

    this.route.use(verifyToken); // jika route yang dituju butuh verify token

    this.route.get("/keeplogin", this.authController.keepLogin);
    this.route.get("/verify", this.authController.verifyAccount);
    this.route.patch("/reset-password", this.authController.resetPassword);
  }

  public getRouter(): Router {
    return this.route;
  }
}
export default AuthRouter;
