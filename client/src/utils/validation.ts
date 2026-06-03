import { z } from 'zod';
import { CATEGORIES_LIST } from '@/constants';
import dayjs from 'dayjs';

export const expenseSchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(Number(val)), 'Amount must be a number')
    .refine((val) => Number(val) > 0, 'Amount must be greater than 0')
    .transform(Number),

  category: z.enum(CATEGORIES_LIST as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a category' }),
  }),

  date: z
    .string()
    .min(1, 'Date is required')
    .refine(
      (val) => dayjs(val).isValid(),
      'Please enter a valid date'
    )
    .refine(
      (val) => !dayjs(val).isAfter(dayjs(), 'day'),
      'Date cannot be in the future'
    ),

  note: z.string().max(500, 'Note cannot exceed 500 characters').optional(),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;

export const budgetSchema = z.object({
  monthlyLimit: z
    .string()
    .min(1, 'Budget limit is required')
    .refine((val) => !isNaN(Number(val)), 'Must be a number')
    .refine((val) => Number(val) > 0, 'Budget must be greater than 0')
    .transform(Number),
});

export type BudgetFormValues = z.infer<typeof budgetSchema>;
