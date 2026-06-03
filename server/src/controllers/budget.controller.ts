import { Request, Response, NextFunction } from 'express';
import { budgetService } from '../services/budget.service';
import type { UpdateBudgetDto } from '../validators/expense.validator';

export const budgetController = {
  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const budgets = await budgetService.getAll();
      res.json({ data: budgets });
    } catch (err) {
      next(err);
    }
  },

  async upsertMany(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { budgets } = req.body as UpdateBudgetDto;
      const result = await budgetService.upsertMany(budgets);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  },
};
