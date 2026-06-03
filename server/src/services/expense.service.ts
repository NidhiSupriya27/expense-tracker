import { expenseRepository } from '../repositories/expense.repository';
import type { CreateExpenseDto, UpdateExpenseDto, ExpenseFiltersDto } from '../validators/expense.validator';
import type { PaginatedResponse } from '../types';
import { Expense } from '@prisma/client';

export const expenseService = {
  async getAll(filters: ExpenseFiltersDto): Promise<PaginatedResponse<Expense>> {
    const { data, total } = await expenseRepository.findAll(filters);

    return {
      data,
      total,
      page: filters.page,
      pageSize: filters.pageSize,
      totalPages: Math.ceil(total / filters.pageSize),
    };
  },

  async getById(id: string): Promise<Expense | null> {
    return expenseRepository.findById(id);
  },

  async create(input: CreateExpenseDto): Promise<Expense> {
    return expenseRepository.create(input);
  },

  async update(id: string, input: UpdateExpenseDto): Promise<Expense | null> {
    const existing = await expenseRepository.findById(id);
    if (!existing) return null;
    return expenseRepository.update(id, input);
  },

  async delete(id: string): Promise<boolean> {
    const existing = await expenseRepository.findById(id);
    if (!existing) return false;
    await expenseRepository.delete(id);
    return true;
  },
};
