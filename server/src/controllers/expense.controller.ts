import { Request, Response, NextFunction } from 'express';
import { expenseService } from '../services/expense.service';
import { NotFoundError } from '../middleware/error.middleware';
import type { CreateExpenseDto, UpdateExpenseDto, ExpenseFiltersDto } from '../validators/expense.validator';

export const expenseController = {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = req.query as unknown as ExpenseFiltersDto;
      const result = await expenseService.getAll(filters);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const expense = await expenseService.getById(req.params.id);
      if (!expense) throw new NotFoundError('Expense');
      res.json({ data: expense });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = req.body as CreateExpenseDto;
      const expense = await expenseService.create(input);
      res.status(201).json({ data: expense });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = req.body as UpdateExpenseDto;
      const expense = await expenseService.update(req.params.id, input);
      if (!expense) throw new NotFoundError('Expense');
      res.json({ data: expense });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await expenseService.delete(req.params.id);
      if (!deleted) throw new NotFoundError('Expense');
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
