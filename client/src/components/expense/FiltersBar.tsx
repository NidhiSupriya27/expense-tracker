import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Button,
  Grid,
  Typography,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import { CATEGORIES_LIST, DATE_RANGE_OPTIONS, type DateRangeOption } from '@/constants';
import { dateRangeToParams } from '@/utils';
import type { ExpenseFilters, Expense } from '@/types';
import { exportToCSV } from '@/utils';

interface FiltersBarProps {
  filters: ExpenseFilters;
  onFiltersChange: (filters: ExpenseFilters) => void;
  onAddExpense: () => void;
  expenses: Expense[]; // visible rows for CSV export
}

export default function FiltersBar({
  filters,
  onFiltersChange,
  onAddExpense,
  expenses,
}: FiltersBarProps) {
  const [dateRange, setDateRange] = useState<DateRangeOption>('all');
  const [showCustom, setShowCustom] = useState(false);

  const handleCategoryChange = (e: SelectChangeEvent) => {
    const val = e.target.value;
    onFiltersChange({ ...filters, category: val === 'all' ? undefined : val });
  };

  const handleDateRangeChange = (e: SelectChangeEvent) => {
    const val = e.target.value as DateRangeOption;
    setDateRange(val);
    setShowCustom(val === 'custom');

    if (val !== 'custom') {
      const { startDate, endDate } = dateRangeToParams(val);
      onFiltersChange({ ...filters, startDate, endDate });
    }
  };

  const handleCustomStart = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, startDate: e.target.value || undefined });
  };

  const handleCustomEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, endDate: e.target.value || undefined });
  };

  return (
    <Card>
      <CardContent sx={{ p: 2.5 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Section label */}
          <Grid item xs={12} sm="auto">
            <Box display="flex" alignItems="center" gap={0.75}>
              <FilterListIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" fontWeight={600} color="text.secondary">
                Filters
              </Typography>
            </Box>
          </Grid>

          {/* Category filter */}
          <Grid item xs={12} sm={3} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                value={filters.category ?? 'all'}
                onChange={handleCategoryChange}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {CATEGORIES_LIST.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Date range preset */}
          <Grid item xs={12} sm={3} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Date Range</InputLabel>
              <Select label="Date Range" value={dateRange} onChange={handleDateRangeChange}>
                {DATE_RANGE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Custom date inputs */}
          {showCustom && (
            <>
              <Grid item xs={6} sm={2}>
                <TextField
                  label="From"
                  type="date"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={filters.startDate ?? ''}
                  onChange={handleCustomStart}
                  inputProps={{ max: new Date().toISOString().split('T')[0] }}
                />
              </Grid>
              <Grid item xs={6} sm={2}>
                <TextField
                  label="To"
                  type="date"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={filters.endDate ?? ''}
                  onChange={handleCustomEnd}
                  inputProps={{ max: new Date().toISOString().split('T')[0] }}
                />
              </Grid>
            </>
          )}

          {/* Spacer */}
          <Grid item xs={12} sm sx={{ display: { xs: 'none', sm: 'block' } }} />

          {/* Actions */}
          <Grid item xs={12} sm="auto">
            <Box display="flex" gap={1.5}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={() => exportToCSV(expenses)}
                disabled={expenses.length === 0}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Export CSV
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={onAddExpense}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Add Expense
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
