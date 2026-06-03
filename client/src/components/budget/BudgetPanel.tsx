import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  LinearProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Tooltip,
  Alert,
  Skeleton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { formatCurrency } from '@/utils';
import { CATEGORY_COLORS, CATEGORIES_LIST } from '@/constants';
import { budgetService } from '@/services/expense.service';
import type { BudgetWithSpend } from '@/types';

interface BudgetPanelProps {
  budgets: BudgetWithSpend[];
  isLoading: boolean;
  onBudgetsUpdated: () => void;
}

export default function BudgetPanel({ budgets, isLoading, onBudgetsUpdated }: BudgetPanelProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [limits, setLimits] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const openEdit = () => {
    // Pre-fill inputs with existing limits
    const prefilled: Record<string, string> = {};
    for (const cat of CATEGORIES_LIST) {
      const existing = budgets.find((b) => b.category === cat);
      prefilled[cat] = existing ? String(existing.monthlyLimit) : '';
    }
    setLimits(prefilled);
    setSaveError(null);
    setEditOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const payload = CATEGORIES_LIST
        .filter((cat) => limits[cat] && Number(limits[cat]) > 0)
        .map((cat) => ({ category: cat, monthlyLimit: Number(limits[cat]) }));

      await budgetService.updateBudgets(payload);
      onBudgetsUpdated();
      setEditOpen(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save budgets');
    } finally {
      setSaving(false);
    }
  };

  const getProgressColor = (budget: BudgetWithSpend): 'error' | 'warning' | 'success' => {
    if (budget.isExceeded) return 'error';
    if (budget.percentUsed >= 80) return 'warning';
    return 'success';
  };

  return (
    <>
      <Card>
        <CardHeader
          title={<Typography variant="h6" fontWeight={700}>Monthly Budgets</Typography>}
          action={
            <Tooltip title="Edit budgets">
              <IconButton size="small" onClick={openEdit}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          }
          sx={{ pb: 0, px: 3, pt: 2.5 }}
        />
        <CardContent sx={{ pt: 2 }}>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Box key={i} sx={{ mb: 2 }}>
                <Skeleton height={16} width="60%" />
                <Skeleton height={8} sx={{ mt: 0.5, borderRadius: 1 }} />
              </Box>
            ))
          ) : budgets.length === 0 ? (
            <Box textAlign="center" py={3}>
              <Typography variant="body2" color="text.secondary">
                No budgets set. Click the edit icon to add budget limits.
              </Typography>
            </Box>
          ) : (
            budgets.map((budget) => {
              const color = CATEGORY_COLORS[budget.category] ?? '#888';
              const progressColor = getProgressColor(budget);

              return (
                <Box key={budget.id} sx={{ mb: 2.5 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.75}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color, flexShrink: 0 }}
                      />
                      <Typography variant="body2" fontWeight={600}>
                        {budget.category}
                      </Typography>
                      {budget.isExceeded && (
                        <Chip
                          icon={<WarningAmberIcon sx={{ fontSize: '14px !important' }} />}
                          label="Over budget"
                          size="small"
                          color="error"
                          variant="outlined"
                          sx={{ height: 20, fontSize: '0.68rem', fontWeight: 600 }}
                        />
                      )}
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="caption" fontWeight={600} color="text.primary">
                        {formatCurrency(budget.spent)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {' '}/ {formatCurrency(budget.monthlyLimit)}
                      </Typography>
                    </Box>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={Math.min(budget.percentUsed, 100)}
                    color={progressColor}
                    sx={{
                      bgcolor: `${color}20`,
                      '& .MuiLinearProgress-bar': { bgcolor: progressColor === 'success' ? color : undefined },
                    }}
                  />

                  <Box display="flex" justifyContent="space-between" mt={0.5}>
                    <Typography variant="caption" color="text.disabled">
                      {budget.percentUsed.toFixed(0)}% used
                    </Typography>
                    <Typography
                      variant="caption"
                      color={budget.isExceeded ? 'error.main' : 'text.disabled'}
                      fontWeight={budget.isExceeded ? 600 : 400}
                    >
                      {budget.isExceeded
                        ? `${formatCurrency(Math.abs(budget.remaining))} over`
                        : `${formatCurrency(budget.remaining)} left`}
                    </Typography>
                  </Box>
                </Box>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Edit Budgets Dialog */}
      <Dialog open={editOpen} onClose={() => !saving && setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight={700}>Set Monthly Budgets</Typography>
        </DialogTitle>
        <DialogContent dividers>
          {saveError && <Alert severity="error" sx={{ mb: 2 }}>{saveError}</Alert>}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Set a monthly spending limit for each category. Leave blank to skip.
          </Typography>
          <Grid container spacing={2}>
            {CATEGORIES_LIST.map((cat) => (
              <Grid item xs={12} sm={6} key={cat}>
                <TextField
                  label={cat}
                  type="number"
                  size="small"
                  fullWidth
                  value={limits[cat] ?? ''}
                  onChange={(e) => setLimits((prev) => ({ ...prev, [cat]: e.target.value }))}
                  InputProps={{
                    startAdornment: <Typography variant="body2" sx={{ mr: 0.5 }}>₹</Typography>,
                  }}
                  inputProps={{ min: 0, step: '100' }}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setEditOpen(false)} disabled={saving} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} variant="contained">
            {saving ? 'Saving…' : 'Save Budgets'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
