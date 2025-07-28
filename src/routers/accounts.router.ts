import { Router } from "express";
import AccountsController from "../controllers/accounts.controller";
import { verifyToken } from "../middleware/verifyToken";
import { uploaderMemory } from "../middleware/uploader";

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
    this.route.delete("/:id", this.accountsController.deleteAccount);
    this.route.patch(
      "/img-profile",
      verifyToken,
      uploaderMemory().single("img"),
      this.accountsController.updateProfileImg
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}
export default AccountsRouter;
