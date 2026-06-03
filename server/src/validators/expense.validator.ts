import { z } from 'zod';
import { CATEGORIES } from '../types';

// Helper: date string must be today or earlier
const dateNotInFuture = z.string().refine(
  (val) => {
    const inputDate = new Date(val);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return !isNaN(inputDate.getTime()) && inputDate <= today;
  },
  { message: 'Date cannot be in the future' }
);

export const createExpenseSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .positive({ message: 'Amount must be greater than 0' })
    .multipleOf(0.01, { message: 'Amount cannot have more than 2 decimal places' }),
  category: z.enum(CATEGORIES, {
    errorMap: () => ({ message: `Category must be one of: ${CATEGORIES.join(', ')}` }),
  }),
  date: dateNotInFuture,
  note: z.string().max(500, 'Note cannot exceed 500 characters').optional(),
});

export const updateExpenseSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .positive({ message: 'Amount must be greater than 0' })
    .multipleOf(0.01)
    .optional(),
  category: z
    .enum(CATEGORIES, {
      errorMap: () => ({ message: `Category must be one of: ${CATEGORIES.join(', ')}` }),
    })
    .optional(),
  date: dateNotInFuture.optional(),
  note: z.string().max(500).optional(),
});

export const updateBudgetSchema = z.object({
  budgets: z.array(
    z.object({
      category: z.enum(CATEGORIES, {
        errorMap: () => ({ message: `Invalid category` }),
      }),
      monthlyLimit: z
        .number({ invalid_type_error: 'Monthly limit must be a number' })
        .positive({ message: 'Monthly limit must be greater than 0' }),
    })
  ),
});

export const expenseFiltersSchema = z.object({
  category: z.enum(CATEGORIES).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export type CreateExpenseDto = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseDto = z.infer<typeof updateExpenseSchema>;
export type UpdateBudgetDto = z.infer<typeof updateBudgetSchema>;
export type ExpenseFiltersDto = z.infer<typeof expenseFiltersSchema>;
