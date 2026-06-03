import { expenseRepository } from '../repositories/expense.repository';
import { budgetRepository } from '../repositories/budget.repository';
import type { SummaryResponse, BudgetWithSpend, CategorySummary } from '../types';
import { Expense } from '@prisma/client';

export const summaryService = {
  /**
   * Compute the summary panel data:
   * - Total spent this calendar month
   * - Breakdown by category (this month)
   * - Highest single expense (this month)
   * - Total transaction count (this month)
   */
  async getSummary(): Promise<SummaryResponse> {
    const thisMonthExpenses = await expenseRepository.findThisMonth();

    const totalThisMonth = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

    const byCategoryMap = new Map<string, CategorySummary>();
    for (const expense of thisMonthExpenses) {
      const existing = byCategoryMap.get(expense.category);
      if (existing) {
        existing.total += expense.amount;
        existing.count += 1;
      } else {
        byCategoryMap.set(expense.category, {
          category: expense.category,
          total: expense.amount,
          count: 1,
        });
      }
    }

    const byCategory = Array.from(byCategoryMap.values()).sort((a, b) => b.total - a.total);

    let highestExpense: Expense | null = null;
    for (const expense of thisMonthExpenses) {
      if (!highestExpense || expense.amount > highestExpense.amount) {
        highestExpense = expense;
      }
    }

    return {
      totalThisMonth,
      highestExpense,
      totalTransactions: thisMonthExpenses.length,
      byCategory,
    };
  },

  /**
   * Compute budget vs. actual spending for the current month.
   * Attaches spent/remaining/percentUsed to each budget record.
   */
  async getBudgetsWithSpend(): Promise<BudgetWithSpend[]> {
    const now = new Date();
    const [budgets, aggregates] = await Promise.all([
      budgetRepository.findAll(),
      expenseRepository.aggregateByCategory(now.getFullYear(), now.getMonth() + 1),
    ]);

    const spendMap = new Map<string, number>();
    for (const agg of aggregates) {
      spendMap.set(agg.category, agg._sum.amount ?? 0);
    }

    return budgets.map((budget) => {
      const spent = spendMap.get(budget.category) ?? 0;
      const remaining = budget.monthlyLimit - spent;
      const percentUsed = budget.monthlyLimit > 0 ? (spent / budget.monthlyLimit) * 100 : 0;

      return {
        ...budget,
        spent,
        remaining,
        percentUsed: Math.round(percentUsed * 10) / 10,
        isExceeded: spent > budget.monthlyLimit,
      };
    });
  },
};
