import { Box, Typography, Button } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = 'No expenses yet',
  description = 'Add your first expense to get started.',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight={240}
      gap={1.5}
      sx={{ py: 6 }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          bgcolor: 'grey.100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 1,
        }}
      >
        <ReceiptLongIcon sx={{ fontSize: 32, color: 'text.disabled' }} />
      </Box>
      <Typography variant="h6" fontWeight={600} color="text.primary">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center" maxWidth={280}>
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" size="small" onClick={onAction} sx={{ mt: 1 }}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
