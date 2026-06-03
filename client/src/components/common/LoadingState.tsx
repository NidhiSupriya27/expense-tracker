import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingStateProps {
  message?: string;
  minHeight?: number | string;
}

export default function LoadingState({ message = 'Loading...', minHeight = 200 }: LoadingStateProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight={minHeight}
      gap={2}
    >
      <CircularProgress size={36} thickness={4} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
