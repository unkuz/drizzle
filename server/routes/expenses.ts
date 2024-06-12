import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string(),
  amount: z.number(),
});

type Expense = z.infer<typeof expenseSchema>;

const createPostSchema = expenseSchema.omit({ id: true });

const fakeExpenses: Expense[] = [
  { id: 1, title: "Rent", amount: 1000 },
  { id: 2, title: "Utilities", amount: 1000 },
  { id: 3, title: "Groceries", amount: 500 },
];

export const expensesRoute = new Hono()
  .get("/", (c) => {
    return c.json({ expenses: fakeExpenses });
  })
  .post("/", zValidator("json", createPostSchema), async (c) => {
    const data = c.req.valid("json");
    fakeExpenses.push({ ...data, id: fakeExpenses.length + 1 });
    c.status(201);
    return c.json(data);
  })
  .get("/:id{[0-9]+}", (c) => {
    const id = +c.req.param("id");
    const expense = fakeExpenses.find((i) => i.id === id);
    if (!expense) {
      return c.notFound();
    }
    return c.json({ expense });
  })
  .delete("/:id{[0-9]+}", (c) => {
    const id = +c.req.param("id");

    const idx = fakeExpenses.findIndex((i) => i.id === id);

    if (idx === -1) {
      return c.notFound();
    }
    const deletedExpense = fakeExpenses.splice(idx, 1)[0];
    return c.json({ deletedExpense });
  })
  .get("/total-spent", (c) => {
    const total = fakeExpenses.reduce((acc, cur) => acc + cur.amount, 0);
    return c.json({ total });
  });
//   .delete
//   .put
