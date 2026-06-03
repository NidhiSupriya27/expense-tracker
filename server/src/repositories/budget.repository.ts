import { prisma } from '../utils/prisma.client';
import type { UpdateBudgetDto } from '../validators/expense.validator';

export const budgetRepository = {
  async findAll() {
    return prisma.budget.findMany({ orderBy: { category: 'asc' } });
  },

  async findByCategory(category: string) {
    return prisma.budget.findUnique({ where: { category } });
  },

  /**
   * Upsert budgets: create if category doesn't exist, update if it does.
   * We process in a transaction to keep the operation atomic.
   */
  async upsertMany(input: UpdateBudgetDto['budgets']) {
    return prisma.$transaction(
      input.map(({ category, monthlyLimit }) =>
        prisma.budget.upsert({
          where: { category },
          update: { monthlyLimit },
          create: { category, monthlyLimit },
        })
      )
    );
  },
};
