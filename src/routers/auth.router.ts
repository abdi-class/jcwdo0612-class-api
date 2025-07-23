import { NextFunction, Request, Response, Router } from "express";
import AuthController from "../controllers/auth.controller";
import { regisValidation } from "../middleware/validation/auth";
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
    this.route.post("/regis", regisValidation, this.authController.register);
  }

  public getRouter(): Router {
    return this.route;
  }
}
export default AuthRouter;
