import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the repositories before importing the service
vi.mock('../repositories/expense.repository', () => ({
  expenseRepository: {
    findThisMonth: vi.fn(),
    aggregateByCategory: vi.fn(),
  },
}));

vi.mock('../repositories/budget.repository', () => ({
  budgetRepository: {
    findAll: vi.fn(),
  },
}));

import { summaryService } from '../services/summary.service';
import { expenseRepository } from '../repositories/expense.repository';
import { budgetRepository } from '../repositories/budget.repository';

const mockExpenses = [
  { id: '1', amount: 500, category: 'Food', date: new Date(), note: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', amount: 1200, category: 'Food', date: new Date(), note: 'Dinner', createdAt: new Date(), updatedAt: new Date() },
  { id: '3', amount: 800, category: 'Transport', date: new Date(), note: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '4', amount: 3500, category: 'Bills', date: new Date(), note: null, createdAt: new Date(), updatedAt: new Date() },
];

describe('summaryService.getSummary', () => {
  beforeEach(() => {
    vi.mocked(expenseRepository.findThisMonth).mockResolvedValue(mockExpenses as any);
  });

  it('calculates total this month correctly', async () => {
    const summary = await summaryService.getSummary();
    // 500 + 1200 + 800 + 3500 = 6000
    expect(summary.totalThisMonth).toBe(6000);
  });

  it('returns the highest single expense', async () => {
    const summary = await summaryService.getSummary();
    expect(summary.highestExpense?.id).toBe('4');
    expect(summary.highestExpense?.amount).toBe(3500);
  });

  it('groups expenses by category correctly', async () => {
    const summary = await summaryService.getSummary();
    const foodCategory = summary.byCategory.find((c) => c.category === 'Food');
    expect(foodCategory?.total).toBe(1700); // 500 + 1200
    expect(foodCategory?.count).toBe(2);
  });

  it('returns correct transaction count', async () => {
    const summary = await summaryService.getSummary();
    expect(summary.totalTransactions).toBe(4);
  });

  it('returns null highestExpense for empty month', async () => {
    vi.mocked(expenseRepository.findThisMonth).mockResolvedValue([]);
    const summary = await summaryService.getSummary();
    expect(summary.highestExpense).toBeNull();
    expect(summary.totalThisMonth).toBe(0);
  });
});

describe('summaryService.getBudgetsWithSpend', () => {
  beforeEach(() => {
    vi.mocked(budgetRepository.findAll).mockResolvedValue([
      { id: 'b1', category: 'Food', monthlyLimit: 5000, createdAt: new Date(), updatedAt: new Date() },
      { id: 'b2', category: 'Transport', monthlyLimit: 2000, createdAt: new Date(), updatedAt: new Date() },
    ] as any);

    vi.mocked(expenseRepository.aggregateByCategory).mockResolvedValue([
      { category: 'Food', _sum: { amount: 6000 }, _count: { id: 3 } },
      { category: 'Transport', _sum: { amount: 800 }, _count: { id: 2 } },
    ] as any);
  });

  it('marks budgets as exceeded when spend > limit', async () => {
    const budgets = await summaryService.getBudgetsWithSpend();
    const food = budgets.find((b) => b.category === 'Food');
    expect(food?.isExceeded).toBe(true);
    expect(food?.spent).toBe(6000);
    expect(food?.remaining).toBe(-1000);
  });

  it('calculates percentage used', async () => {
    const budgets = await summaryService.getBudgetsWithSpend();
    const transport = budgets.find((b) => b.category === 'Transport');
    expect(transport?.percentUsed).toBe(40); // 800/2000 * 100
    expect(transport?.isExceeded).toBe(false);
  });
});
