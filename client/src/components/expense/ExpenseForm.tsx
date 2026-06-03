import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
  Alert,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import { expenseSchema, type ExpenseFormValues } from '@/utils/validation';
import { CATEGORIES_LIST } from '@/constants';
import type { Expense } from '@/types';

interface ExpenseFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ExpenseFormValues) => Promise<void>;
  initialValues?: Expense | null;
  isSubmitting: boolean;
  error: string | null;
}

export default function ExpenseForm({
  open,
  onClose,
  onSubmit,
  initialValues,
  isSubmitting,
  error,
}: ExpenseFormProps) {
  const isEditing = Boolean(initialValues);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: '' as unknown as number,
      category: '' as ExpenseFormValues['category'],
      date: dayjs().format('YYYY-MM-DD'),
      note: '',
    },
  });

  // When editing, populate the form with existing values
  useEffect(() => {
    if (initialValues) {
      reset({
        amount: initialValues.amount as unknown as number,
        category: initialValues.category as ExpenseFormValues['category'],
        date: dayjs(initialValues.date).format('YYYY-MM-DD'),
        note: initialValues.note ?? '',
      });
    } else {
      reset({
        amount: '' as unknown as number,
        category: '' as ExpenseFormValues['category'],
        date: dayjs().format('YYYY-MM-DD'),
        note: '',
      });
    }
  }, [initialValues, reset, open]);

  const handleClose = () => {
    if (!isSubmitting) onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight={700}>
            {isEditing ? 'Edit Expense' : 'Add New Expense'}
          </Typography>
          <IconButton size="small" onClick={handleClose} disabled={isSubmitting}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent dividers sx={{ pt: 2.5 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2.5}>
            {/* Amount */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Amount"
                    type="number"
                    required
                    error={Boolean(errors.amount)}
                    helperText={errors.amount?.message}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    inputProps={{ min: 0, step: '0.01' }}
                  />
                )}
              />
            </Grid>

            {/* Category */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small" error={Boolean(errors.category)} required>
                    <InputLabel>Category</InputLabel>
                    <Select {...field} label="Category">
                      {CATEGORIES_LIST.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.category && (
                      <FormHelperText>{errors.category.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Date */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Date"
                    type="date"
                    required
                    error={Boolean(errors.date)}
                    helperText={errors.date?.message}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ max: dayjs().format('YYYY-MM-DD') }}
                  />
                )}
              />
            </Grid>

            {/* Note */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="note"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Note (optional)"
                    placeholder="e.g. Lunch with team"
                    error={Boolean(errors.note)}
                    helperText={errors.note?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} disabled={isSubmitting} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Expense'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
