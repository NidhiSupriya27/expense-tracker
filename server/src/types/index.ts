export const CATEGORIES = [
  'Food',
  'Transport',
  'Bills',
  'Entertainment',
  'Health',
  'Shopping',
  'Other',
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: Date;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  id: string;
  category: string;
  monthlyLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExpenseInput {
  amount: number;
  category: string;
  date: string; // ISO string from client
  note?: string;
}

export interface UpdateExpenseInput {
  amount?: number;
  category?: string;
  date?: string;
  note?: string;
}

export interface ExpenseFilters {
  category?: string;
  startDate?: string;
  endDate?: string;
}

export interface CategorySummary {
  category: string;
  total: number;
  count: number;
}

export interface SummaryResponse {
  totalThisMonth: number;
  highestExpense: Expense | null;
  totalTransactions: number;
  byCategory: CategorySummary[];
}

export interface BudgetWithSpend extends Budget {
  spent: number;
  remaining: number;
  percentUsed: number;
  isExceeded: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
