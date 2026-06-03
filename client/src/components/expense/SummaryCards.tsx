import { Grid, Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ReceiptIcon from '@mui/icons-material/Receipt';
import StarIcon from '@mui/icons-material/Star';
import { formatCurrency, formatDate } from '@/utils';
import type { Summary } from '@/types';

interface SummaryCardsProps {
  summary: Summary | null;
  isLoading: boolean;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent: string;
  isLoading: boolean;
}

function StatCard({ icon, label, value, sub, accent, isLoading }: StatCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing="0.05em">
              {label}
            </Typography>
            {isLoading ? (
              <>
                <Skeleton width={120} height={36} sx={{ mt: 0.5 }} />
                <Skeleton width={80} height={20} />
              </>
            ) : (
              <>
                <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                  {value}
                </Typography>
                {sub && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {sub}
                  </Typography>
                )}
              </>
            )}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: `${accent}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: accent,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function SummaryCards({ summary, isLoading }: SummaryCardsProps) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          icon={<TrendingUpIcon />}
          label="This Month's Spend"
          value={summary ? formatCurrency(summary.totalThisMonth) : '—'}
          sub={`${summary?.totalTransactions ?? 0} transactions`}
          accent="#E94560"
          isLoading={isLoading}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          icon={<StarIcon />}
          label="Highest Expense"
          value={summary?.highestExpense ? formatCurrency(summary.highestExpense.amount) : '—'}
          sub={
            summary?.highestExpense
              ? `${summary.highestExpense.category} · ${formatDate(summary.highestExpense.date)}`
              : 'No expenses this month'
          }
          accent="#F59E0B"
          isLoading={isLoading}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          icon={<ReceiptIcon />}
          label="Total Transactions"
          value={summary ? String(summary.totalTransactions) : '—'}
          sub={
            summary?.byCategory.length
              ? `Across ${summary.byCategory.length} categories`
              : 'No expenses this month'
          }
          accent="#10B981"
          isLoading={isLoading}
        />
      </Grid>
    </Grid>
  );
}
