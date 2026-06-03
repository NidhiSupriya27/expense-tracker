import { Chip } from '@mui/material';
import { CATEGORY_COLORS } from '@/constants';

interface CategoryChipProps {
  category: string;
  size?: 'small' | 'medium';
}

export default function CategoryChip({ category, size = 'small' }: CategoryChipProps) {
  const color = CATEGORY_COLORS[category] ?? '#B0B0B0';

  return (
    <Chip
      label={category}
      size={size}
      sx={{
        bgcolor: `${color}20`,
        color: color,
        border: `1px solid ${color}40`,
        fontWeight: 600,
        fontSize: '0.72rem',
      }}
    />
  );
}
