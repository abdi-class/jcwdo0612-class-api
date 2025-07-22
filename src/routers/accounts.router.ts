import { Router } from "express";
import AccountsController from "../controllers/accounts.controller";

class AccountsRouter {
  // define type of property
  private route: Router;
  private accountsController: AccountsController;

  constructor() {
    this.route = Router();
    this.accountsController = new AccountsController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.get("/", this.accountsController.getAllData);
    this.route.put("/:id", this.accountsController.update);
  }

  public getRouter(): Router {
    return this.route;
  }
}
export default AccountsRouter;
