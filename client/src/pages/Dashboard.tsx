import { useState, useCallback } from 'react';
import { Box, Grid, Snackbar, Alert } from '@mui/material';

import AppShell from '@/layouts/AppShell';
import SummaryCards from '@/components/expense/SummaryCards';
import FiltersBar from '@/components/expense/FiltersBar';
import ExpenseTable from '@/components/expense/ExpenseTable';
import ExpenseForm from '@/components/expense/ExpenseForm';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import SpendingPieChart from '@/components/charts/SpendingPieChart';
import CategoryBarChart from '@/components/charts/CategoryBarChart';
import BudgetPanel from '@/components/budget/BudgetPanel';

import { useExpenses } from '@/hooks/useExpenses';
import { useSummary } from '@/hooks/useSummary';
import { useBudgets } from '@/hooks/useBudgets';
import { useChartData } from '@/hooks/useChartData';

import { expenseService } from '@/services/expense.service';
import type { Expense, ExpenseFilters } from '@/types';
import type { ExpenseFormValues } from '@/utils/validation';

export default function Dashboard() {
  // ─── Filters ──────────────────────────────────────────────────────────────
  const [filters, setFilters] = useState<ExpenseFilters>({});

  // ─── Data fetching ────────────────────────────────────────────────────────
  const { expenses, total, totalPages, page, isLoading, error: listError, setPage, refetch: refetchExpenses } =
    useExpenses(filters);
  const { summary, isLoading: summaryLoading, refetch: refetchSummary } = useSummary();
  const { budgets, isLoading: budgetsLoading, refetch: refetchBudgets } = useBudgets();

  // ─── Chart data (memoized) ────────────────────────────────────────────────
  const { pieData, barData } = useChartData(expenses);

  // ─── Form state ───────────────────────────────────────────────────────────
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Expense | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // ─── Delete state ─────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ─── Toast ────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const showToast = (message: string, severity: 'success' | 'error' = 'success') => {
    setToast({ message, severity });
  };

  // ─── Refresh all data after a mutation ───────────────────────────────────
  const refreshAll = useCallback(() => {
    refetchExpenses();
    refetchSummary();
    refetchBudgets();
  }, [refetchExpenses, refetchSummary, refetchBudgets]);

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleAddExpense = () => {
    setEditTarget(null);
    setFormError(null);
    setFormOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditTarget(expense);
    setFormError(null);
    setFormOpen(true);
  };

  const handleDeleteExpense = (expense: Expense) => {
    setDeleteTarget(expense);
  };

  const handleFormSubmit = async (values: ExpenseFormValues) => {
    setFormSubmitting(true);
    setFormError(null);
    try {
      if (editTarget) {
        await expenseService.update(editTarget.id, {
          ...values,
          amount: Number(values.amount),
        });
        showToast('Expense updated successfully');
      } else {
        await expenseService.create({ ...values, amount: Number(values.amount) });
        showToast('Expense added successfully');
      }
      setFormOpen(false);
      refreshAll();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save expense');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await expenseService.delete(deleteTarget.id);
      showToast('Expense deleted');
      setDeleteTarget(null);
      refreshAll();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to delete', 'error');
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <AppShell>
      <Box display="flex" flexDirection="column" gap={3}>
        {/* Summary KPI cards */}
        <SummaryCards summary={summary} isLoading={summaryLoading} />

        {/* Filters + Add button */}
        <FiltersBar
          filters={filters}
          onFiltersChange={setFilters}
          onAddExpense={handleAddExpense}
          expenses={expenses}
        />

        {/* Main grid: table + sidebar */}
        <Grid container spacing={3}>
          {/* Transactions table — takes most of the width */}
          <Grid item xs={12} lg={8}>
            <ExpenseTable
              expenses={expenses}
              total={total}
              page={page}
              totalPages={totalPages}
              isLoading={isLoading}
              onPageChange={setPage}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
              onAddExpense={handleAddExpense}
            />
          </Grid>

          {/* Right sidebar: budgets */}
          <Grid item xs={12} lg={4}>
            <BudgetPanel
              budgets={budgets}
              isLoading={budgetsLoading}
              onBudgetsUpdated={refreshAll}
            />
          </Grid>
        </Grid>

        {/* Charts row */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <SpendingPieChart data={pieData} />
          </Grid>
          <Grid item xs={12} md={7}>
            <CategoryBarChart data={barData} />
          </Grid>
        </Grid>
      </Box>

      {/* Create / Edit modal */}
      <ExpenseForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialValues={editTarget}
        isSubmitting={formSubmitting}
        error={formError}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Expense?"
        message={
          deleteTarget
            ? `This will permanently delete the ${deleteTarget.category} expense of ${
                new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(
                  deleteTarget.amount
                )
              }. This action cannot be undone.`
            : ''
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteLoading}
      />

      {/* Toast notifications */}
      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3500}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToast(null)}
          severity={toast?.severity ?? 'success'}
          variant="filled"
          sx={{ minWidth: 250 }}
        >
          {toast?.message}
        </Alert>
      </Snackbar>
    </AppShell>
  );
}
