import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express, { Application, Request, Response } from "express";
import AccountsRouter from "./routers/accounts.router";

const PORT: string = process.env.PORT || "8181";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configure();
    this.route();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private route(): void {
    const accountsRouter: AccountsRouter = new AccountsRouter();
    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).send("<h1>Classbase API</h1>");
    });

    this.app.use("/accounts", accountsRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`API RUNNING: http://localhost:${PORT}`);
    });
  }
}

export default App;
