import { Hono } from "hono";
import { logger } from "hono/logger";
import { expensesRoute } from "./routes/expenses";

const app = new Hono();

export const customLogger = (message: string, ...rest: string[]) => {
  console.log(message, ...rest);
};

app.use(logger(customLogger));

app.get("/", (c) => c.text("Hono!"));

app.route("/api/expenses", expensesRoute)

export default app;
