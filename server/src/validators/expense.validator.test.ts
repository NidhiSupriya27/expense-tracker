import { describe, it, expect } from 'vitest';
import { createExpenseSchema, updateExpenseSchema } from '../validators/expense.validator';

describe('createExpenseSchema', () => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().split('T')[0];

  it('accepts a valid expense', () => {
    const result = createExpenseSchema.safeParse({
      amount: 250.5,
      category: 'Food',
      date: yesterday,
      note: 'Lunch',
    });
    expect(result.success).toBe(true);
  });

  it('accepts today as date', () => {
    const result = createExpenseSchema.safeParse({
      amount: 100,
      category: 'Transport',
      date: today,
    });
    expect(result.success).toBe(true);
  });

  it('rejects negative amount', () => {
    const result = createExpenseSchema.safeParse({
      amount: -50,
      category: 'Food',
      date: yesterday,
    });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toContain('greater than 0');
  });

  it('rejects zero amount', () => {
    const result = createExpenseSchema.safeParse({
      amount: 0,
      category: 'Food',
      date: yesterday,
    });
    expect(result.success).toBe(false);
  });

  it('rejects future date', () => {
    const result = createExpenseSchema.safeParse({
      amount: 100,
      category: 'Food',
      date: tomorrow,
    });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toContain('future');
  });

  it('rejects missing category', () => {
    const result = createExpenseSchema.safeParse({
      amount: 100,
      date: yesterday,
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid category', () => {
    const result = createExpenseSchema.safeParse({
      amount: 100,
      category: 'InvalidCat',
      date: yesterday,
    });
    expect(result.success).toBe(false);
  });

  it('accepts expense without optional note', () => {
    const result = createExpenseSchema.safeParse({
      amount: 100,
      category: 'Bills',
      date: yesterday,
    });
    expect(result.success).toBe(true);
  });
});

describe('updateExpenseSchema', () => {
  it('accepts partial updates', () => {
    const result = updateExpenseSchema.safeParse({ amount: 500 });
    expect(result.success).toBe(true);
  });

  it('accepts empty object (no-op update)', () => {
    const result = updateExpenseSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('still rejects negative amount on update', () => {
    const result = updateExpenseSchema.safeParse({ amount: -10 });
    expect(result.success).toBe(false);
  });
});
