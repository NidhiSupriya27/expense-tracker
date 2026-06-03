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
  date: string; // ISO string
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  category: string;
  monthlyLimit: number;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetWithSpend extends Budget {
  spent: number;
  remaining: number;
  percentUsed: number;
  isExceeded: boolean;
}

export interface CategorySummary {
  category: string;
  total: number;
  count: number;
}

export interface Summary {
  totalThisMonth: number;
  highestExpense: Expense | null;
  totalTransactions: number;
  byCategory: CategorySummary[];
}

export interface ExpenseFilters {
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
}

// Form inputs (validated by Zod)
export interface CreateExpenseForm {
  amount: number;
  category: Category;
  date: string;
  note?: string;
}

export interface UpdateExpenseForm {
  amount?: number;
  category?: Category;
  date?: string;
  note?: string;
}

export interface BudgetForm {
  category: Category;
  monthlyLimit: number;
}
