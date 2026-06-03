import React from 'react';
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Toolbar sx={{ minHeight: 64 }}>
          <AccountBalanceWalletIcon sx={{ mr: 1.5, fontSize: 28, color: theme.palette.secondary.main }} />
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              letterSpacing: '-0.01em',
              fontSize: '1.2rem',
            }}
          >
            Spendwise
          </Typography>
          
          <Box sx={{ flexGrow: 1 }} />
          
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}
