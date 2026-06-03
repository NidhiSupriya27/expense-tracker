import { Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma.client';
import type { CreateExpenseDto, UpdateExpenseDto, ExpenseFiltersDto } from '../validators/expense.validator';

export const expenseRepository = {
  async findAll(filters: ExpenseFiltersDto) {
    const { category, startDate, endDate, page, pageSize } = filters;

    const where: Prisma.ExpenseWhereInput = {};

    if (category) {
      where.category = category;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        (where.date as Prisma.DateTimeFilter).gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        (where.date as Prisma.DateTimeFilter).lte = end;
      }
    }

    const [total, data] = await Promise.all([
      prisma.expense.count({ where }),
      prisma.expense.findMany({
        where,
        orderBy: { date: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return { data, total };
  },

  async findById(id: string) {
    return prisma.expense.findUnique({ where: { id } });
  },

  async create(input: CreateExpenseDto) {
    return prisma.expense.create({
      data: {
        amount: input.amount,
        category: input.category,
        date: new Date(input.date),
        note: input.note ?? null,
      },
    });
  },

  async update(id: string, input: UpdateExpenseDto) {
    return prisma.expense.update({
      where: { id },
      data: {
        ...(input.amount !== undefined && { amount: input.amount }),
        ...(input.category !== undefined && { category: input.category }),
        ...(input.date !== undefined && { date: new Date(input.date) }),
        ...(input.note !== undefined && { note: input.note }),
      },
    });
  },

  async delete(id: string) {
    return prisma.expense.delete({ where: { id } });
  },

  /**
   * Fetch all expenses for the current calendar month —
   * used by the summary service to compute monthly totals.
   */
  async findThisMonth() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    return prisma.expense.findMany({
      where: { date: { gte: start, lte: end } },
    });
  },

  /**
   * Aggregate total spend per category for a given month.
   * Used for budget vs. actual calculations.
   */
  async aggregateByCategory(year: number, month: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    return prisma.expense.groupBy({
      by: ['category'],
      where: { date: { gte: start, lte: end } },
      _sum: { amount: true },
      _count: { id: true },
    });
  },
};
