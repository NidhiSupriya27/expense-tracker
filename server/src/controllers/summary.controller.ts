import { Request, Response, NextFunction } from 'express';
import { summaryService } from '../services/summary.service';

export const summaryController = {
  async getSummary(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const summary = await summaryService.getSummary();
      res.json({ data: summary });
    } catch (err) {
      next(err);
    }
  },

  async getBudgetsWithSpend(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const budgets = await summaryService.getBudgetsWithSpend();
      res.json({ data: budgets });
    } catch (err) {
      next(err);
    }
  },
};
