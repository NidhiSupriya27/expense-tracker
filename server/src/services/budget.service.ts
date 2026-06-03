import { budgetRepository } from '../repositories/budget.repository';
import type { UpdateBudgetDto } from '../validators/expense.validator';
import { Budget } from '@prisma/client';

export const budgetService = {
  async getAll(): Promise<Budget[]> {
    return budgetRepository.findAll();
  },

  async upsertMany(input: UpdateBudgetDto['budgets']): Promise<Budget[]> {
    return budgetRepository.upsertMany(input);
  },
};
