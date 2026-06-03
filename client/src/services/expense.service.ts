import apiClient from './api.client';
import type {
  Expense,
  CreateExpenseForm,
  UpdateExpenseForm,
  ExpenseFilters,
  PaginatedResponse,
  Summary,
  Budget,
  BudgetWithSpend,
  BudgetForm,
  ApiResponse,
} from '@/types';

export const expenseService = {
  async getAll(filters: ExpenseFilters = {}): Promise<PaginatedResponse<Expense>> {
    // Remove undefined keys so they're not sent as "undefined" strings
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== '')
    );
    const { data } = await apiClient.get<PaginatedResponse<Expense>>('/api/expenses', { params });
    return data;
  },

  async getById(id: string): Promise<Expense> {
    const { data } = await apiClient.get<ApiResponse<Expense>>(`/api/expenses/${id}`);
    return data.data;
  },

  async create(input: CreateExpenseForm): Promise<Expense> {
    const { data } = await apiClient.post<ApiResponse<Expense>>('/api/expenses', input);
    return data.data;
  },

  async update(id: string, input: UpdateExpenseForm): Promise<Expense> {
    const { data } = await apiClient.put<ApiResponse<Expense>>(`/api/expenses/${id}`, input);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/expenses/${id}`);
  },
};

export const summaryService = {
  async getSummary(): Promise<Summary> {
    const { data } = await apiClient.get<ApiResponse<Summary>>('/api/summary');
    return data.data;
  },

  async getBudgetsWithSpend(): Promise<BudgetWithSpend[]> {
    const { data } = await apiClient.get<ApiResponse<BudgetWithSpend[]>>('/api/budgets/with-spend');
    return data.data;
  },
};

export const budgetService = {
  async getAll(): Promise<Budget[]> {
    const { data } = await apiClient.get<ApiResponse<Budget[]>>('/api/budgets');
    return data.data;
  },

  async updateBudgets(budgets: BudgetForm[]): Promise<Budget[]> {
    const { data } = await apiClient.put<ApiResponse<Budget[]>>('/api/budgets', { budgets });
    return data.data;
  },
};
