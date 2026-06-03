import { Box, Card, CardContent, CardHeader, Typography, useTheme } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatCurrency } from '@/utils';
import EmptyState from '@/components/common/EmptyState';

interface PieEntry {
  name: string;
  value: number;
  fill: string;
}

interface SpendingPieChartProps {
  data: PieEntry[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: PieEntry }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
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
        {item.name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {formatCurrency(item.value)}
      </Typography>
    </Box>
  );
}

export default function SpendingPieChart({ data }: SpendingPieChartProps) {
  const theme = useTheme();

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={<Typography variant="h6" fontWeight={700}>Spending by Category</Typography>}
        sx={{ pb: 0, px: 3, pt: 2.5 }}
      />
      <CardContent>
        {data.length === 0 ? (
          <EmptyState
            title="No data"
            description="Add expenses to see your spending breakdown."
            minHeight={220}
          />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => (
                  <Typography component="span" variant="caption" color={theme.palette.text.secondary}>
                    {value}
                  </Typography>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
