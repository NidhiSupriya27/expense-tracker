import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  minHeight?: number | string;
}

export default function ErrorState({
  message = 'Something went wrong.',
  onRetry,
  minHeight = 200,
}: ErrorStateProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight={minHeight}
      gap={2}
    >
      <ErrorOutlineIcon sx={{ fontSize: 40, color: 'error.main', opacity: 0.7 }} />
      <Typography variant="body1" color="text.secondary" textAlign="center">
        {message}
      </Typography>
      {onRetry && (
        <Button variant="outlined" size="small" onClick={onRetry}>
          Try again
        </Button>
      )}
    </Box>
  );
}
