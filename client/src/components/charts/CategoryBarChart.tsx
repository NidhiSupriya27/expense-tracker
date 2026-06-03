import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { formatCurrency } from '@/utils';
import EmptyState from '@/components/common/EmptyState';

interface BarEntry {
  category: string;
  amount: number;
  fill: string;
}

interface CategoryBarChartProps {
  data: BarEntry[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: 1.5,
        boxShadow: 3,
      }}
    >
      <Typography variant="body2" fontWeight={700}>
        {label}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {formatCurrency(payload[0].value)}
      </Typography>
    </Box>
  );
}

export default function CategoryBarChart({ data }: CategoryBarChartProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={<Typography variant="h6" fontWeight={700}>Category Totals</Typography>}
        sx={{ pb: 0, px: 3, pt: 2.5 }}
      />
      <CardContent>
        {data.length === 0 ? (
          <EmptyState
            title="No data"
            description="Add expenses to see category totals."
            minHeight={220}
          />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 11, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F9FAFB' }} />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.category} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
