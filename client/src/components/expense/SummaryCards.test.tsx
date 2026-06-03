import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { theme } from '@/utils/theme';
import SummaryCards from '@/components/expense/SummaryCards';
import type { Summary } from '@/types';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

const mockSummary: Summary = {
  totalThisMonth: 12450.75,
  totalTransactions: 8,
  highestExpense: {
    id: 'exp-1',
    amount: 3500,
    category: 'Bills',
    date: '2024-03-10T00:00:00.000Z',
    note: 'Electricity',
    createdAt: '2024-03-10T08:00:00.000Z',
    updatedAt: '2024-03-10T08:00:00.000Z',
  },
  byCategory: [
    { category: 'Food', total: 4500, count: 4 },
    { category: 'Bills', total: 3500, count: 1 },
    { category: 'Transport', total: 2450.75, count: 3 },
  ],
};

describe('SummaryCards', () => {
  it('renders all three KPI cards', () => {
    renderWithTheme(<SummaryCards summary={mockSummary} isLoading={false} />);

    expect(screen.getByText("This Month's Spend")).toBeInTheDocument();
    expect(screen.getByText('Highest Expense')).toBeInTheDocument();
    expect(screen.getByText('Total Transactions')).toBeInTheDocument();
  });

  it('formats currency correctly in INR', () => {
    renderWithTheme(<SummaryCards summary={mockSummary} isLoading={false} />);
    // Intl.NumberFormat en-IN formats 12450.75 as ₹12,450.75
    expect(screen.getByText('₹12,450.75')).toBeInTheDocument();
  });

  it('shows the highest expense amount and category', () => {
    renderWithTheme(<SummaryCards summary={mockSummary} isLoading={false} />);
    expect(screen.getByText('₹3,500.00')).toBeInTheDocument();
    // Sub-label contains category
    expect(screen.getByText(/Bills/)).toBeInTheDocument();
  });

  it('shows transaction count', () => {
    renderWithTheme(<SummaryCards summary={mockSummary} isLoading={false} />);
    // The large "8" value for total transactions
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('8 transactions')).toBeInTheDocument();
  });

  it('renders skeleton loaders when isLoading is true', () => {
    const { container } = renderWithTheme(
      <SummaryCards summary={null} isLoading={true} />
    );
    // MUI Skeleton renders with role="progressbar" or a span with aria-busy
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows em-dash placeholders when summary is null and not loading', () => {
    renderWithTheme(<SummaryCards summary={null} isLoading={false} />);
    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThanOrEqual(3);
  });

  it('shows category span count when there are categories', () => {
    renderWithTheme(<SummaryCards summary={mockSummary} isLoading={false} />);
    expect(screen.getByText('Across 3 categories')).toBeInTheDocument();
  });
});
