import { Router } from 'express';
import { summaryController } from '../controllers/summary.controller';
import { budgetController } from '../controllers/budget.controller';
import { validate } from '../middleware/validate.middleware';
import { updateBudgetSchema } from '../validators/expense.validator';

const summaryRouter = Router();
const budgetRouter = Router();

// GET /api/summary
summaryRouter.get('/', summaryController.getSummary);

// GET  /api/budgets            — get all budgets with current month spend
// PUT  /api/budgets            — upsert one or more budget limits
budgetRouter.get('/', budgetController.getAll);
budgetRouter.get('/with-spend', summaryController.getBudgetsWithSpend);
budgetRouter.put('/', validate(updateBudgetSchema), budgetController.upsertMany);

export { summaryRouter, budgetRouter };
