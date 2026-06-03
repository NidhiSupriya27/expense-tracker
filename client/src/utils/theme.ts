import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    success: Palette['primary'];
  }
}

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1A1A2E',
      light: '#16213E',
      dark: '#0F0F1A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E94560',
      light: '#FF6B8A',
      dark: '#C1203D',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F4F6F9',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A2E',
      secondary: '#6B7280',
    },
    divider: '#E5E7EB',
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#F59E0B',
      light: '#FCD34D',
      dark: '#D97706',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
  },
  typography: {
    fontFamily: '"DM Sans", "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 600, letterSpacing: '-0.01em' },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    body1: { fontSize: '0.9375rem' },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(0,0,0,0.06), 0px 1px 2px rgba(0,0,0,0.04)',
    '0px 4px 6px rgba(0,0,0,0.05), 0px 2px 4px rgba(0,0,0,0.04)',
    '0px 10px 15px rgba(0,0,0,0.07), 0px 4px 6px rgba(0,0,0,0.05)',
    '0px 20px 25px rgba(0,0,0,0.1), 0px 10px 10px rgba(0,0,0,0.04)',
    '0px 25px 50px rgba(0,0,0,0.12)',
    ...Array(19).fill('none'),
  ] as any,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0F0F1A 0%, #1A1A2E 100%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #E94560 0%, #C1203D 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #C1203D 0%, #A01830 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 6px rgba(0,0,0,0.05), 0px 2px 4px rgba(0,0,0,0.04)',
          border: '1px solid #E5E7EB',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small', fullWidth: true },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiSelect: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            fontWeight: 600,
            color: '#6B7280',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            backgroundColor: '#F9FAFB',
            borderBottom: '2px solid #E5E7EB',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #F3F4F6',
          padding: '12px 16px',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          padding: '8px',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 8,
        },
      },
    },
  },
});
