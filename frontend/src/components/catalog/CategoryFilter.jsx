import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

const categories = [
  { value: '', label: 'All pets' },
  { value: 'CATS', label: 'Cats' },
  { value: 'DOGS', label: 'Dogs' },
  { value: 'FISH', label: 'Fish' },
  { value: 'BIRDS', label: 'Birds' },
];

export default function CategoryFilter({ value, onChange }) {
  return (
    <div>
      <Typography variant="overline" sx={{ letterSpacing: 1.5, color: 'text.secondary' }}>
        Filter by category
      </Typography>
      <ToggleButtonGroup
        exclusive
        value={value}
        onChange={(_, nextValue) => onChange(nextValue ?? '')}
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          mt: 1,
          '& .MuiToggleButton-root': {
            borderRadius: 999,
            px: 2,
            textTransform: 'none',
            borderColor: 'rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        {categories.map((category) => (
          <ToggleButton key={category.value || 'all'} value={category.value}>
            {category.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
}
